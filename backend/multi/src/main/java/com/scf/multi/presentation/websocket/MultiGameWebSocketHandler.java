package com.scf.multi.presentation.websocket;

import com.scf.multi.application.MultiGameService;
import com.scf.multi.domain.dto.Player;
import java.util.Map;
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
    private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, Player> sessionPlayers = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        String userId = (String) session.getAttributes().get("userId");
        String username = (String) session.getAttributes().get("username");

        if (username != null) {
            sessionPlayers.put(session.getId(), new Player(userId, username));
            sessions.put(session.getId(), session);
            broadcastMessage(username + " 님이 게임에 참가 하였습니다.");
        } else {
            session.close();
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        Player player = sessionPlayers.get(session.getId());

        String content = message.getPayload();

        multiGameService.markSolution(player.getUserId(), content);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
        throws Exception {

        Player player = sessionPlayers.remove(session.getId());
        sessions.remove(session.getId());

        if (player != null) {
            broadcastMessage(player.getName() + "님이 게임을 나갔습니다.");
        }
    }

    public void broadcastMessage(String message) throws Exception {

        for (WebSocketSession session : sessions.values()) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }
}
