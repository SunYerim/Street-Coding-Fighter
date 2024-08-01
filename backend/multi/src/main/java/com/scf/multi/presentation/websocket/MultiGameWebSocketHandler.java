package com.scf.multi.presentation.websocket;

import com.scf.multi.application.MultiGameService;
import com.scf.multi.application.UserService;
import com.scf.multi.domain.dto.problem.Problem;
import com.scf.multi.domain.dto.socket_message.Content;
import com.scf.multi.domain.dto.socket_message.Message;
import com.scf.multi.domain.dto.user.Player;
import com.scf.multi.domain.dto.user.Rank;
import com.scf.multi.domain.dto.user.Solved;
import com.scf.multi.domain.model.MultiGameRoom;
import com.scf.multi.global.utils.JsonConverter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
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
    private final UserService userService;
    private final Map<String, Player> sessionPlayers = new ConcurrentHashMap<>(); // session ID -> player (player 이름, 아이디 알려고)
    private final Map<String, String> sessionRooms = new ConcurrentHashMap<>(); // session ID -> room ID (유저가 어떤 방에 연결됐는지 알려고)
    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>(); // room ID -> sessions (방에 연결된 유저들을 알려고)
    private final Map<Long, List<Solved>> solveds = Collections.synchronizedMap(new HashMap<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        String roomId = (String) session.getAttributes().get("roomId");
        Long userId = (Long) session.getAttributes().get("userId");
        String username = (String) session.getAttributes().get("username");

        MultiGameRoom room = multiGameService.findOneById(roomId);

        boolean isHost = room.getHostId().equals(userId);

        Player player = Player.builder()
            .userId(userId)
            .username(username)
            .isHost(isHost)
            .build();
        sessionPlayers.put(session.getId(), player);
        sessionRooms.put(session.getId(), roomId);
        rooms.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);

        broadcastMessageToRoom(room.getRoomId(), username + " 님이 게임에 참가 하였습니다.");
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage textMessage)
        throws Exception {

        String msg = textMessage.getPayload();
        Message message = JsonConverter.getInstance().toObject(msg, Message.class);

        String roomId = sessionRooms.get(session.getId());

        if (message.getType().equals("solve")) {

            Player player = sessionPlayers.get(session.getId());

            Solved solved = saveSolved(roomId, player.getUserId(), message.getContent());// 푼 문제 저장

            int attainedScore = multiGameService.markSolution(roomId, player,
                solved); // 문제 채점

            session.sendMessage(new TextMessage(Integer.toString(attainedScore)));

        } else if (message.getType().equals("fin")) {

            MultiGameRoom room = multiGameService.findOneById(roomId);

            room.nextRound();

            if (room.getRound().equals(room.getPlayRound())) { // 마지막 라운드이면
                userService.saveUserSolveds(solveds);
            }

            List<Rank> ranks = room.calculateRank();
            String rankMsg = JsonConverter.getInstance().toString(ranks);

            session.sendMessage(new TextMessage(rankMsg));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
        throws Exception {

        Player player = sessionPlayers.remove(session.getId());

        String roomId = sessionRooms.get(session.getId());
        if (roomId != null) {
            multiGameService.exitRoom(roomId, player.getUserId());
            Set<WebSocketSession> roomSessions = rooms.get(roomId);
            if (roomSessions != null) {
                roomSessions.remove(session);
                if (roomSessions.isEmpty()) { // 방에 포함된 마지막 유저가 나갔을 경우 방을 삭제
                    rooms.remove(roomId);
                    multiGameService.deleteRoom(roomId);
                }
            }

            broadcastMessageToRoom(roomId, player.getUsername() + "님이 게임을 나갔습니다.");
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

    private Solved saveSolved(String roomId, Long userId, Content content) {

        MultiGameRoom room = multiGameService.findOneById(roomId);

        List<Problem> problems = room.getProblems();
        Problem problem = problems.get(room.getRound());

        Solved solved = Solved
            .builder()
            .userId(userId)
            .problemId(problem.getProblemId())
            .solve(content.getSolve())
            .submitTime(content.getSubmitTime())
            .build();

        // 문제를 해결한 리스트를 가져오거나, 없으면 새로운 리스트를 생성
        List<Solved> solvedList = solveds.computeIfAbsent(userId, k -> new ArrayList<>());
        solvedList.add(solved); // 리스트에 문제 추가

        return solved;
    }
}
