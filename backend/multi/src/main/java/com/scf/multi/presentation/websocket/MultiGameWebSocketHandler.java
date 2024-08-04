package com.scf.multi.presentation.websocket;

import static com.scf.multi.global.error.ErrorCode.GAME_ALREADY_STARTED;
import static com.scf.multi.global.error.ErrorCode.USER_NOT_FOUND;

import com.scf.multi.application.MultiGameService;
import com.scf.multi.domain.dto.user.GameResult;
import com.scf.multi.domain.event.GameStartedEvent;
import com.scf.multi.domain.dto.socket_message.request.Message;
import com.scf.multi.domain.dto.socket_message.response.ResponseMessage;
import com.scf.multi.domain.dto.user.Player;
import com.scf.multi.domain.dto.user.Rank;
import com.scf.multi.domain.dto.user.Solved;
import com.scf.multi.domain.model.MultiGameRoom;
import com.scf.multi.global.error.exception.BusinessException;
import com.scf.multi.global.utils.JsonConverter;
import com.scf.multi.infrastructure.KafkaMessageProducer;
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
    private final KafkaMessageProducer kafkaMessageProducer;
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

        Player player = room.getPlayers().stream()
            .filter(p -> p.getSessionId().equals(session.getId())).findFirst()
            .orElseThrow(() -> new BusinessException(session.getId(), "sessionId", USER_NOT_FOUND));

        if (!room.getIsStart()) {
            return;
        }

        String msg = textMessage.getPayload();
        Message message = JsonConverter.getInstance().toObject(msg, Message.class);

        Solved solved = multiGameService.makeSolved(room, player.getUserId(), message.getContent());
        player.addSolved(solved);

        int attainedScore = multiGameService.markSolution(roomId, player, solved); // 문제 채점

        ResponseMessage attainScoreObj = ResponseMessage.builder()
            .type("attainScore")
            .payload(attainedScore)
            .build();

        String attainScoreMessage = JsonConverter.getInstance().toString(attainScoreObj);
        session.sendMessage(new TextMessage(attainScoreMessage));

        int curSubmitCount = room.getCurSubmitCount().incrementAndGet();

        if (curSubmitCount == room.getPlayers().size()) { // 각 라운드마다 모든 플레이어가 풀이를 제출했으면

            room.nextRound(); // 다음 라운드 진행

            List<Rank> roundRank = room.getRoundRank();
            broadcastMessageToRoom(roomId, "roundRank", roundRank);

            List<Rank> gameRank = room.getGameRank();
            broadcastMessageToRoom(roomId, "gameRank", gameRank);

            if (room.getRound().equals(room.getPlayRound())) { // 마지막 라운드이면

                for (Player p : room.getPlayers()) { // 방에 참여한 모든 유저 푼 문제 저장
                    List<Solved> solveds = p.getSolveds();
                    if (solveds != null) {
                        kafkaMessageProducer.sendSolved(solveds);
                    }
                }

                GameResult gameResult = GameResult.builder()
                    .gameRank(gameRank)
                    .build();
                kafkaMessageProducer.sendResult(gameResult); // 게임 최종 결과 저장

                room.finishGame();
            }

            room.getCurSubmitCount().set(0); // 제출 횟수 초기화
        }
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

    public void broadcastMessageToRoom(String roomId, String type, Object payload)
        throws Exception {

        Set<WebSocketSession> roomSessions = rooms.get(roomId);

        if (roomSessions != null) {

            for (WebSocketSession session : roomSessions) {

                if (session.isOpen()) {

                    ResponseMessage responseMessage = ResponseMessage.builder()
                        .type(type)
                        .payload(payload)
                        .build();

                    String message = JsonConverter.getInstance().toString(responseMessage);

                    session.sendMessage(new TextMessage(message));
                }
            }
        }
    }
}
