package com.scf.multi.presentation.websocket;

import com.scf.multi.application.MultiGameService;
import com.scf.multi.domain.dto.problem.ProblemResponse.ListDTO;
import com.scf.multi.domain.event.GameStartedEvent;
import com.scf.multi.domain.dto.socket_message.request.SolvedMessage;
import com.scf.multi.domain.dto.socket_message.response.ResponseMessage;
import com.scf.multi.domain.dto.user.Player;
import com.scf.multi.domain.dto.user.Rank;
import com.scf.multi.domain.dto.user.Solved;
import com.scf.multi.domain.model.MultiGameRoom;
import com.scf.multi.global.error.exception.BusinessException;
import com.scf.multi.global.utils.JsonConverter;
import java.io.IOException;
import java.util.List;
import java.util.Map;
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
    private final static Map<String, String> rooms = new ConcurrentHashMap<>(); // session ID -> room ID (유저가 어떤 방에 연결됐는지 알려고)
    private final static Map<String, Set<WebSocketSession>> sessionRooms = new ConcurrentHashMap<>(); // room ID -> sessions (방에 연결된 유저들을 알려고)

    @EventListener
    public void onGameStarted(GameStartedEvent event) throws Exception {

        String roomId = event.getRoomId();
        List<ListDTO> problems = multiGameService.getProblems(roomId);
        broadcastMessageToRoom(roomId, "gameStart", problems);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        String roomId = (String) session.getAttributes().get("roomId");
        Long userId = (Long) session.getAttributes().get("userId");

        multiGameService.validatePlayerToRoom(roomId, userId);

        Player connectedPlayer = multiGameService.connectPlayer(roomId, userId, session.getId());

        addPlayerSessionToRoom(session, roomId);

        broadcastMessageToRoom(roomId, "notice",
            connectedPlayer.getUsername() + " 님이 게임에 참가 하였습니다.");
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage textMessage)
        throws Exception {

        String roomId = rooms.get(session.getId());
        MultiGameRoom room = multiGameService.findOneById(roomId);
        if (!room.getIsStart()) {
            return;
        }

        SolvedMessage solvedMessage = getSolvedMessage(textMessage);

        Solved solved = multiGameService.addSolved(room, session.getId(),
            solvedMessage.getContent());

        int attainedScore = multiGameService.markSolution(roomId, solved); // 문제 채점

        String attainScoreMessage = makeResponseMessage("attainScore", attainedScore);
        sendMessage(session, attainScoreMessage);

        handleRoundCompletion(room);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
        throws Exception {

        String roomId = rooms.get(session.getId());

        Player exitPlayer = multiGameService.handlePlayerExit(roomId, session.getId());

        removePlayerFromRoom(session, roomId);

        broadcastMessageToRoom(roomId, "notice", exitPlayer.getUsername() + "님이 게임을 나갔습니다.");

        hostRotateIfNecessary(roomId, exitPlayer);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception)
        throws Exception {
        // 예외 처리 로직
        if (exception instanceof BusinessException e) {
            session.sendMessage(new TextMessage(
                "[Error]: " + e.getMessage() + " " + e.getFieldName() + " : "
                    + e.getInvalidValue()));
        } else {
            super.handleTransportError(session, exception);
        }
    }

    private static void sendMessage(WebSocketSession session, String attainScoreMessage)
        throws IOException {
        session.sendMessage(new TextMessage(attainScoreMessage));
    }

    private void broadcastMessageToRoom(String roomId, String type, Object payload)
        throws Exception {

        Set<WebSocketSession> roomSessions = sessionRooms.get(roomId);

        if (roomSessions != null) {

            String message = makeResponseMessage(type, payload);

            for (WebSocketSession session : roomSessions) {
                if (session.isOpen()) {
                    sendMessage(session, message);
                }
            }
        }
    }

    private static void addPlayerSessionToRoom(WebSocketSession session, String roomId) {
        rooms.put(session.getId(), roomId);
        sessionRooms.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
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

    private void hostRotateIfNecessary(String roomId, Player exitPlayer) throws Exception {
        if (exitPlayer.getIsHost() && sessionRooms.get(roomId) != null && !sessionRooms.get(roomId).isEmpty()) {

            Player newHost = multiGameService.rotateHost(roomId);

            broadcastMessageToRoom(roomId, "newHost", newHost.getUserId()); // 새로운 방장 broadcasting
        }
    }

    private void removePlayerFromRoom(WebSocketSession session, String roomId) {
        Set<WebSocketSession> roomSessions = sessionRooms.get(roomId);
        if (roomSessions != null) {

            roomSessions.remove(session); // 나간 유저 방에서 삭제

            if (roomSessions.isEmpty()) { // 방에 포함된 마지막 유저가 나갔을 경우 방을 삭제
                sessionRooms.remove(roomId);
                multiGameService.deleteRoom(roomId);
            }
        }
    }
}
