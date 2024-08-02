    package com.scf.multi.presentation.websocket;

    import static com.scf.multi.global.error.ErrorCode.GAME_ALREADY_STARTED;
    import static com.scf.multi.global.error.ErrorCode.USER_NOT_FOUND;

    import com.scf.multi.application.MultiGameService;
    import com.scf.multi.domain.dto.problem.Problem;
    import com.scf.multi.domain.dto.socket_message.Content;
    import com.scf.multi.domain.dto.socket_message.Message;
    import com.scf.multi.domain.dto.user.GameRank;
    import com.scf.multi.domain.dto.user.Player;
    import com.scf.multi.domain.dto.user.RoundRank;
    import com.scf.multi.domain.dto.user.Solved;
    import com.scf.multi.domain.model.MultiGameRoom;
    import com.scf.multi.global.error.exception.BusinessException;
    import com.scf.multi.global.utils.JsonConverter;
    import com.scf.multi.infrastructure.KafkaMessageProducer;
    import java.util.ArrayList;
    import java.util.Collections;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;
    import java.util.Optional;
    import java.util.Set;
    import java.util.concurrent.ConcurrentHashMap;
    import java.util.concurrent.atomic.AtomicInteger;
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
        private final KafkaMessageProducer kafkaMessageProducer;
        private final Map<String, Player> sessionPlayers = new ConcurrentHashMap<>(); // session ID -> player (player 이름, 아이디 알려고)
        private final Map<String, String> sessionRooms = new ConcurrentHashMap<>(); // session ID -> room ID (유저가 어떤 방에 연결됐는지 알려고)
        private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>(); // room ID -> sessions (방에 연결된 유저들을 알려고)
        private final Map<Long, List<Solved>> solveds = Collections.synchronizedMap(new HashMap<>());
        private final AtomicInteger curAtomicSubmitCount = new AtomicInteger(0);
        private final List<RoundRank> roundRanks = Collections.synchronizedList(new ArrayList<>());

        @Override
        public void afterConnectionEstablished(WebSocketSession session) throws Exception {

            String roomId = (String) session.getAttributes().get("roomId");
            Long userId = (Long) session.getAttributes().get("userId");
            String username = (String) session.getAttributes().get("username");

            MultiGameRoom room = multiGameService.findOneById(roomId);

            boolean isInRoom = room.getPlayers().stream()
                .anyMatch(player -> player.getUserId().equals(userId));

            if(!isInRoom) {
                throw new BusinessException(userId, "userId", USER_NOT_FOUND);
            }

            if(room.getIsStart()) {
                throw new BusinessException(roomId, "roomId", GAME_ALREADY_STARTED);
            }

            boolean isHost = room.getHostId().equals(userId);

            Player player = Player.builder()
                .userId(userId)
                .username(username)
                .isHost(isHost)
                .streakCount(0)
                .build();
            sessionPlayers.put(session.getId(), player);
            sessionRooms.put(session.getId(), roomId);
            rooms.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);

            System.out.println(session.getId());
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

                Solved solved = saveSolved(roomId, player.getUserId(), message.getContent()); // 푼 문제 저장

                int attainedScore = multiGameService.markSolution(roomId, player, solved); // 문제 채점

                session.sendMessage(new TextMessage(Integer.toString(attainedScore)));

                MultiGameRoom room = multiGameService.findOneById(roomId);

                int curSubmitCount = curAtomicSubmitCount.incrementAndGet();// 제출된 풀이 수 증가

                if (curSubmitCount <= 3) {
                    roundRanks.add(
                        RoundRank.builder()
                            .userId(player.getUserId())
                            .username(player.getUsername())
                            .score(attainedScore)
                            .rank(curSubmitCount).build());
                }

                if (curSubmitCount == room.getPlayers().size()) { // 각 라운드마다 모든 플레이어가 풀이를 제출했으면

                    room.nextRound(); // 다음 라운드 진행

                    List<GameRank> gameRank = room.calculateRank();
                    String gameRankMsg = JsonConverter.getInstance().toString(gameRank);
                    String roundRankMsg = JsonConverter.getInstance().toString(roundRanks);
                    broadcastMessageToRoom(roomId, roundRankMsg);
                    broadcastMessageToRoom(roomId, gameRankMsg);
                    roundRanks.clear();

                    if (room.getRound().equals(room.getPlayRound())) { // 마지막 라운드이면

                        List<Solved> userSolved = solveds.get(player.getUserId()); // 푼 문제 저장
                        if (userSolved != null) {
                            for (Solved s : userSolved) {
                                kafkaMessageProducer.sendSolved(s);
                            }
                        }

                        for (GameRank rank : gameRank) { // 게임 최종 결과 저장
                            kafkaMessageProducer.sendResult(rank);
                        }

                        curAtomicSubmitCount.set(0);
                    }
                }
            }
        }

        @Override
        public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
            throws Exception {

            Player exitPlayer = sessionPlayers.remove(session.getId());

            String roomId = sessionRooms.get(session.getId());
            if (roomId != null) {
                multiGameService.exitRoom(roomId, exitPlayer.getUserId());
                Set<WebSocketSession> roomSessions = rooms.get(roomId);
                if (roomSessions != null) {
                    roomSessions.remove(session);
                    if (roomSessions.isEmpty()) { // 방에 포함된 마지막 유저가 나갔을 경우 방을 삭제
                        rooms.remove(roomId);
                        multiGameService.deleteRoom(roomId);
                    }
                }

                broadcastMessageToRoom(roomId, exitPlayer.getUsername() + "님이 게임을 나갔습니다.");

                if (exitPlayer.getIsHost() && !rooms.get(roomId).isEmpty()) { // 방장 rotate
                    Optional<WebSocketSession> hostSession = rooms.get(roomId).stream().findFirst();
                    String sessionId = hostSession.get().getId();
                    Player newHost = sessionPlayers.get(sessionId);
                    newHost.setIsHost(true);
                    broadcastMessageToRoom(roomId, newHost.getUserId().toString());
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

        private Solved saveSolved(String roomId, Long userId, Content content) {

            MultiGameRoom room = multiGameService.findOneById(roomId);

            List<Problem> problems = room.getProblems();
            Problem problem = problems.get(room.getRound());

            Solved solved = Solved
                .builder()
                .userId(userId)
                .problemId(problem.getProblemId())
                .solve(content.getSolve())
                .solveText(content.getSolveText())
                .submitTime(content.getSubmitTime())
                .build();

            // 문제를 해결한 리스트를 가져오거나, 없으면 새로운 리스트를 생성
            List<Solved> solvedList = solveds.computeIfAbsent(userId, k -> new ArrayList<>());
            solvedList.add(solved); // 리스트에 문제 추가

            return solved;
        }
    }
