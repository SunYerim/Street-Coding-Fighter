package com.scf.multi.presentation.websocket;

import com.scf.multi.application.MultiGameService;
import com.scf.multi.domain.dto.Player;
import com.scf.multi.domain.model.MultiGameRoom;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class MultiGameWebSocketHandler extends TextWebSocketHandler {

    private final MultiGameService multiGameService;
    private final Map<String, Player> sessionPlayers = new ConcurrentHashMap<>(); // session ID -> player (player 이름, 아이디 알려고)
    private final Map<String, String> sessionRooms = new ConcurrentHashMap<>(); // session ID -> room ID (유저가 어떤 방에 연결됐는지 알려고)
    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>(); // room ID -> sessions (방에 연결된 유저들을 알려고)

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        String roomId = (String) session.getAttributes().get("roomId");
        Long userId = (Long) session.getAttributes().get("userId");
        String username = (String) session.getAttributes().get("username");

        MultiGameRoom room = multiGameService.findOneById(roomId);

        if (room == null) {
            return;
        }

        sessionPlayers.put(session.getId(), new Player(userId, username));
        sessionRooms.put(session.getId(), roomId);
        rooms.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);

        broadcastMessageToRoom(room.getRoomId(), username + " 님이 게임에 참가 하였습니다.");
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        Player player = sessionPlayers.get(session.getId());

        String roomId = sessionRooms.get(session.getId());

        String content = message.getPayload();

        multiGameService.markSolution(roomId, player.getUserId(), content);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
        throws Exception {

        Player player = sessionPlayers.remove(session.getId());

        String roomId = sessionRooms.get(session.getId());
        if (roomId != null) { //
            Set<WebSocketSession> roomSessions = rooms.get(roomId);
            if (roomSessions != null) {
                roomSessions.remove(session);
                if (roomSessions.isEmpty()) {
                    rooms.remove(roomId);
                }
            }

            if (player != null) {
                broadcastMessageToRoom(roomId, player.getName() + "님이 게임을 나갔습니다.");
            }
        }
    }

    public void broadcastMessageToRoom(String roomId, String message) throws Exception {

        Set<WebSocketSession> roomSessions = rooms.get(roomId);

        if (roomSessions != null) {
            for (WebSocketSession session : roomSessions) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(message));
                }
            }
        }
    }
}
