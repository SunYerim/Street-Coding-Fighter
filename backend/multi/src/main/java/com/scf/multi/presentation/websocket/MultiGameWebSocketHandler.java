package com.scf.multi.presentation.websocket;

import static com.scf.multi.global.error.ErrorCode.GAME_ALREADY_STARTED;
import static com.scf.multi.global.error.ErrorCode.USER_NOT_FOUND;

import com.scf.multi.application.MultiGameService;
import com.scf.multi.domain.dto.user.GameResult;
import com.scf.multi.domain.event.GameStartedEvent;
import com.scf.multi.domain.dto.socket_message.request.SolvedMessage;
import com.scf.multi.domain.dto.socket_message.response.ResponseMessage;
import com.scf.multi.domain.dto.user.Player;
import com.scf.multi.domain.dto.user.Rank;
import com.scf.multi.domain.dto.user.Solved;
import com.scf.multi.domain.model.MultiGameRoom;
import com.scf.multi.global.error.exception.BusinessException;
import com.scf.multi.global.utils.JsonConverter;
import com.scf.multi.infrastructure.KafkaMessageProducer;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class MultiGameWebSocketHandler extends TextWebSocketHandler {

    private final MultiGameService multiGameService;
    private final static Map<String, String> sessionRooms = new ConcurrentHashMap<>(); // session ID -> room ID (유저가 어떤 방에 연결됐는지 알려고)
    private final static Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>(); // room ID -> sessions (방에 연결된 유저들을 알려고)

    @EventListener
    public void onGameStarted(GameStartedEvent event) throws Exception {

        String roomId = event.getRoomId();
        broadcastMessageToRoom(roomId, "gameStart", "게임이 시작되었습니다!");
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        String roomId = (String) session.getAttributes().get("roomId");
        Long userId = (Long) session.getAttributes().get("userId");

        MultiGameRoom room = multiGameService.findOneById(roomId);

        if (room.getIsStart()) {
            throw new BusinessException(roomId, "roomId", GAME_ALREADY_STARTED);
        }

        Player connectedPlayer = room.getPlayers().stream()
            .filter(player -> player.getUserId().equals(userId)).findFirst()
            .orElseThrow(() -> new BusinessException(userId, "userId", USER_NOT_FOUND));
        connectedPlayer.setSessionId(session.getId());

        sessionRooms.put(session.getId(), roomId);
        rooms.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);

        broadcastMessageToRoom(room.getRoomId(), "notice",
            connectedPlayer.getUsername() + " 님이 게임에 참가 하였습니다.");
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage textMessage)
        throws Exception {

        String roomId = sessionRooms.get(session.getId());
        MultiGameRoom room = multiGameService.findOneById(roomId);
        if (!room.getIsStart()) {
            return;
        }

        SolvedMessage solvedMessage = getSolvedMessage(textMessage);

        Solved solved = multiGameService.addSolved(room, session.getId(), solvedMessage.getContent());

        int attainedScore = multiGameService.markSolution(roomId, solved); // 문제 채점

        String attainScoreMessage = makeResponseMessage("attainScore", attainedScore);
        sendMessage(session, attainScoreMessage);

        handleRoundCompletion(room);
    }

    private static void sendMessage(WebSocketSession session, String attainScoreMessage)
        throws IOException {
        session.sendMessage(new TextMessage(attainScoreMessage));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
        throws Exception {

        String roomId = sessionRooms.get(session.getId());
        MultiGameRoom room = multiGameService.findOneById(roomId);
        Player exitPlayer = room.getPlayers().stream()
            .filter(p -> p.getSessionId().equals(session.getId())).findFirst()
            .orElseThrow(
                () -> new BusinessException(session.getId(), "sessionId", USER_NOT_FOUND));
        room.exitRoom(exitPlayer);

        Set<WebSocketSession> roomSessions = rooms.get(roomId);
        if (roomSessions != null) {

            roomSessions.remove(session); // 나간 유저 방에서 삭제

            if (roomSessions.isEmpty()) { // 방에 포함된 마지막 유저가 나갔을 경우 방을 삭제
                rooms.remove(roomId);
                multiGameService.deleteRoom(roomId);
            }
        }

        broadcastMessageToRoom(roomId, "notice", exitPlayer.getUsername() + "님이 게임을 나갔습니다.");

        if (exitPlayer.getIsHost() && !rooms.get(roomId).isEmpty()) { // 방장 rotate
            Optional<WebSocketSession> newHostSession = rooms.get(roomId).stream()
                .findFirst(); // 방에 연결된 플레이어 session 찾기
            String sessionId = newHostSession.get().getId();

            Player newHost = room.getPlayers().stream() // 방에 sessionId와 동일한 플레이어 찾기
                .filter(player -> player.getSessionId().equals(sessionId)).findFirst()
                .orElseThrow(
                    () -> new BusinessException(sessionId, "sessionId", USER_NOT_FOUND));

            newHost.setIsHost(true); // 방장으로 설정
            room.updateHost(newHost); // 방장 정보 업데이트

            broadcastMessageToRoom(roomId, "newHost",
                newHost.getUserId()); // 새로운 방장 broadCasting
        }

    }

    private void broadcastMessageToRoom(String roomId, String type, Object payload)
        throws Exception {

        Set<WebSocketSession> roomSessions = rooms.get(roomId);

        if (roomSessions != null) {

            String message = makeResponseMessage(type, payload);

            for (WebSocketSession session : roomSessions) {
                if (session.isOpen()) {
                    sendMessage(session, message);
                }
            }
        }
    }

    private static SolvedMessage getSolvedMessage(TextMessage textMessage) throws IOException {

        String msg = textMessage.getPayload();
        return JsonConverter.getInstance().toObject(msg, SolvedMessage.class);
    }

    private static String makeResponseMessage(String type, Object payload) throws IOException {
        ResponseMessage responseMessage = ResponseMessage.builder()
            .type(type)
            .payload(payload)
            .build();
        return JsonConverter.getInstance().toString(responseMessage);
    }

    private void handleRoundCompletion(MultiGameRoom room) throws Exception {

        int curSubmitCount = room.getCurSubmitCount().incrementAndGet();

        if (curSubmitCount == room.getPlayers().size()) {
            room.nextRound();

            List<Rank> roundRank = room.getRoundRank();
            broadcastMessageToRoom(room.getRoomId(), "roundRank", roundRank);

            List<Rank> gameRank = room.getGameRank();
            broadcastMessageToRoom(room.getRoomId(), "gameRank", gameRank);

            if (room.getRound().equals(room.getPlayRound())) {
                multiGameService.finalizeGame(room, gameRank);
            }

            room.getCurSubmitCount().set(0);
        }
    }
}
