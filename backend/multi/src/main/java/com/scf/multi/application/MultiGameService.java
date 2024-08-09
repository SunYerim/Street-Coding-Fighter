package com.scf.multi.application;

import static com.scf.multi.global.error.ErrorCode.GAME_ALREADY_STARTED;
import static com.scf.multi.global.error.ErrorCode.USER_NOT_FOUND;

import com.scf.multi.domain.dto.user.GameResult;
import com.scf.multi.domain.dto.user.Rank;
import com.scf.multi.domain.dto.user.SubmitItem;
import com.scf.multi.domain.event.GameStartedEvent;
import com.scf.multi.domain.dto.room.RoomRequest.CreateRoomDTO;
import com.scf.multi.domain.dto.room.RoomResponse;
import com.scf.multi.domain.dto.problem.Problem;
import com.scf.multi.domain.dto.problem.ProblemAnswer;
import com.scf.multi.domain.dto.problem.ProblemChoice;
import com.scf.multi.domain.dto.problem.ProblemResponse;
import com.scf.multi.domain.dto.problem.ProblemType;
import com.scf.multi.domain.dto.socket_message.request.Content;
import com.scf.multi.domain.dto.user.Player;
import com.scf.multi.domain.dto.user.Solved;
import com.scf.multi.domain.model.MultiGameRoom;
import com.scf.multi.domain.repository.MultiGameRepository;
import com.scf.multi.global.error.ErrorCode;
import com.scf.multi.global.error.exception.BusinessException;
import com.scf.multi.infrastructure.KafkaMessageProducer;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MultiGameService {

    private static final int MAX_SUBMIT_TIME = 30;
    private static final int BASE_SCORE = 10;
    private static final int STREAK_BONUS = 75;

    private final MultiGameRepository multiGameRepository;
    private final ProblemService problemService;
    private final ApplicationEventPublisher eventPublisher;
    private final KafkaMessageProducer kafkaMessageProducer;

    public List<RoomResponse.ListDTO> findAllRooms() {

        return multiGameRepository.findAllRooms()
            .stream()
            .map(this::mapToRoomListDTO)
            .toList();
    }

    public MultiGameRoom findOneById(String roomId) {

        return Optional.ofNullable(multiGameRepository.findOneById(roomId))
            .orElseThrow(() -> new BusinessException(roomId, "roomId", ErrorCode.ROOM_NOT_FOUND));
    }

    public String createRoom(Long userId, String username, CreateRoomDTO createRoomDTO) {

        String roomId = UUID.randomUUID().toString();

        MultiGameRoom room = createRoomDTO.toEntity(roomId, userId, username);

        // 게임을 생성하면 방장을 방에 참가 시킴
        Player hostPlayer = createHostPlayer(userId, username);
        room.add(createRoomDTO.getPassword(), hostPlayer);

        multiGameRepository.addRoom(room);

        return roomId;
    }

    public void deleteRoom(String roomId) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);

        if (room == null) {
            throw new BusinessException(roomId, "roomId", ErrorCode.ROOM_NOT_FOUND);
        }

        multiGameRepository.deleteRoom(roomId);
    }

    public void joinRoom(String roomId, String roomPassword, Long userId, String username) {

        MultiGameRoom room = findOneById(roomId);

        boolean isHost = room.getHostId().equals(userId);

        Player player = createPlayer(userId, username, isHost);
        room.add(roomPassword, player);
    }

    public void validateRoom(String roomId) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);

        if (room.getIsStart()) {
            throw new BusinessException(roomId, "roomId", GAME_ALREADY_STARTED);
        }
    }

    public Player connectPlayer(String roomId, Long userId, String sessionId) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);
        Player connectedPlayer = findPlayerByUserId(room, userId);
        connectedPlayer.setSessionId(sessionId);

        room.addSubmitItem(userId);

        return connectedPlayer;
    }

    public void startGame(String roomId, Long userId) {

        MultiGameRoom room = findOneById(roomId);

        List<Problem> problems = fetchProblems(room);

        room.gameStart(problems, userId);
        eventPublisher.publishEvent(new GameStartedEvent(roomId));
    }

    public Solved addSolved(String roomId, String sessionId, Content content) {

        MultiGameRoom room = findOneById(roomId);

        Player player = findPlayerBySessionId(room, sessionId);
        Problem currentProblem = getCurrentProblem(room);

        Solved solved = Solved
            .builder()
            .userId(player.getUserId())
            .problemId(currentProblem.getProblemId())
            .solve(content.getSolve())
            .solveText(content.getSolveText())
            .submitTime(content.getSubmitTime())
            .build();
        player.addSolved(solved);

        return solved;
    }

    public int markSolution(String roomId, Solved solved) {

        MultiGameRoom room = findRoom(roomId);
        Player player = findPlayerByUserId(room, solved.getUserId());
        Problem problem = getCurrentProblem(room);

        validateProblem(problem);

        boolean isCorrect = isAnswerCorrect(problem, solved);
        int score = calculateScoreIfCorrect(isCorrect, player.getStreakCount(),
            solved.getSubmitTime());

        solved.setIsCorrect(isCorrect);

        return score;
    }

    public Player handlePlayerExit(String roomId, String sessionId) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);

        Player exitPlayer = findPlayerBySessionId(room, sessionId);
        room.exitRoom(exitPlayer);

        return exitPlayer;
    }

    public Player rotateHost(String roomId) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);

        Player newHost = room.getPlayers().stream()
            .findFirst()
            .orElseThrow(() -> new BusinessException(null, "newHost", USER_NOT_FOUND));
        newHost.setIsHost(true);
        room.updateHost(newHost);

        return newHost;
    }

    public List<ProblemResponse.ListDTO> getProblems(String roomId) {

        MultiGameRoom room = findOneById(roomId);

        // problem -> problemList
        return room.getProblems().stream()
            .map(this::mapToProblemListDTO)
            .toList();
    }

    public List<Player> getPlayerList(String roomId) {

        MultiGameRoom room = findOneById(roomId);
        return room.getPlayers();
    }

    public boolean increaseSubmit(String roomId) {

        MultiGameRoom room = findOneById(roomId);

        int curSubmitCount = room.getCurSubmitCount().incrementAndGet();

        if (curSubmitCount == room.getPlayers().size()) {
            room.nextRound();

            room.getCurSubmitCount().set(0);

            return true;
        }
        return false;
    }

    public List<Rank> getRoundRank(String roomId) {

        MultiGameRoom room = findOneById(roomId);

        return room.getRoundRank();
    }

    public List<Rank> getGameRank(String roomId) {

        MultiGameRoom room = findOneById(roomId);

        return room.getGameRank();
    }

    public void finalizeGame(String roomId) {

        MultiGameRoom room = findOneById(roomId);

        room.getPlayers().forEach(player ->
            Optional.ofNullable(player.getSolveds()).ifPresent(solveds ->
                solveds.forEach(kafkaMessageProducer::sendSolved)
            )
        );

        kafkaMessageProducer.sendResult(GameResult.builder().gameRank(room.getGameRank()).build());

        room.finishGame();
    }

    public boolean checkIsFinishGame(String roomId) {

        MultiGameRoom room = findOneById(roomId);

        return room.getRound().equals(room.getPlayRound());
    }

    public void updateScoreBoard(String roomId, String sessionId, int score) {

        MultiGameRoom room = findOneById(roomId);

        Player player = room.getPlayers().stream()
            .filter(p -> p.getSessionId().equals(sessionId)).toList().getFirst();

        room.updateScoreBoard(player.getUserId(), score);
    }

    public void updateLeaderBoard(String roomId, String sessionId, int score) {

        MultiGameRoom room = findOneById(roomId);

        Player player = room.getPlayers().stream()
            .filter(p -> p.getSessionId().equals(sessionId)).toList().getFirst();

        room.updateScoreBoard(player.getUserId(), score);

        room.updateLeaderBoard(player.getUserId(), score);
    }

    public void changeSubmitItem(String roomId, String sessionId, boolean isSubmit) {

        MultiGameRoom room = findOneById(roomId);

        Player player = findPlayerBySessionId(room, sessionId);

        SubmitItem playerSubmitItem = room.getSubmits().stream()
            .filter(submitItem -> submitItem.getUserId().equals(player.getUserId())).toList()
            .getFirst();

        playerSubmitItem.setIsSubmit(isSubmit);
    }

    public List<SubmitItem> getSubmits(String roomId) {

        MultiGameRoom room = findOneById(roomId);

        return room.getSubmits();
    }

    private RoomResponse.ListDTO mapToRoomListDTO(MultiGameRoom room) {
        return RoomResponse.ListDTO.builder()
            .roomId(room.getRoomId())
            .title(room.getTitle())
            .hostname(room.getHostname())
            .maxPlayer(room.getMaxPlayer())
            .curPlayer(room.getPlayers().size())
            .isLock(room.getPassword() != null)
            .isStart(room.getIsStart())
            .build();
    }

    private Player createHostPlayer(Long userId, String username) {
        return Player.builder()
            .userId(userId)
            .username(username)
            .isHost(true)
            .streakCount(0)
            .build();
    }

    private Player createPlayer(Long userId, String username, boolean isHost) {
        return Player.builder()
            .userId(userId)
            .username(username)
            .isHost(isHost)
            .streakCount(0)
            .build();
    }

    private MultiGameRoom findRoom(String roomId) {
        return multiGameRepository.findOneById(roomId);
    }

    private List<Problem> fetchProblems(MultiGameRoom room) {
        List<Problem> problems = problemService.getProblems(room.getPlayRound());

        if (problems == null || problems.isEmpty()) {
            throw new BusinessException(null, "problems", ErrorCode.PROBLEM_NOT_FOUND);
        }
        return problems;
    }

    private ProblemResponse.ListDTO mapToProblemListDTO(Problem problem) {
        return ProblemResponse.ListDTO.builder()
            .problemId(problem.getProblemId())
            .title(problem.getTitle())
            .problemType(problem.getProblemType())
            .category(problem.getCategory())
            .difficulty(problem.getDifficulty())
            .problemContent(problem.getProblemContent())
            .problemChoices(problem.getProblemChoices())
            .build();
    }

    private Problem getCurrentProblem(MultiGameRoom room) {
        List<Problem> problems = room.getProblems();
        return problems.get(room.getRound());
    }

    private Player findPlayerByUserId(MultiGameRoom room, Long userId) {
        return room.getPlayers().stream()
            .filter(p -> p.getUserId().equals(userId))
            .findFirst()
            .orElseThrow(() -> new BusinessException(userId, "userId", USER_NOT_FOUND));
    }

    private Player findPlayerBySessionId(MultiGameRoom room, String sessionId) {
        return room.getPlayers().stream()
            .filter(p -> p.getSessionId().equals(sessionId)).findFirst()
            .orElseThrow(() -> new BusinessException(sessionId, "sessionId", USER_NOT_FOUND));
    }

    private boolean isAnswerCorrect(Problem problem, Solved solved) {
        List<ProblemAnswer> answers = problem.getProblemAnswers();
        ProblemType problemType = problem.getProblemType();
        return compareWith(problemType, solved, answers);
    }

    private void validateProblem(Problem problem) {
        if (problem == null) {
            throw new BusinessException(null, "problem", ErrorCode.PROBLEM_NOT_FOUND);
        }
    }

    private int calculateScoreIfCorrect(boolean isCorrect, int streakCount, int submitTime) {
        if (isCorrect) {
            return calculateScore(streakCount, submitTime);
        }
        return 0;
    }

    private boolean compareWith(ProblemType problemType, Solved solved,
        List<ProblemAnswer> answers) {

        return switch (problemType) {
            case MULTIPLE_CHOICE -> compareMultipleChoice(solved, answers);
            case SHORT_ANSWER_QUESTION -> compareShortAnswer(solved, answers);
            case FILL_IN_THE_BLANK -> compareFillInTheBlank(solved, answers);
        };
    }

    private boolean compareMultipleChoice(Solved solved, List<ProblemAnswer> answers) {
        Map<Integer, Integer> solve = solved.getSolve();

        if (solve == null) {
            return false;
        }

        ProblemChoice correctChoice = answers.getFirst().getCorrectChoice();

        return correctChoice.getChoiceId().equals(solve.get(1));
    }

    private boolean compareShortAnswer(Solved solved, List<ProblemAnswer> answers) {
        String correctAnswerText = answers.getFirst().getCorrectAnswerText();

        if (correctAnswerText == null) {
            return false;
        }

        return correctAnswerText.equals(solved.getSolveText());
    }

    private boolean compareFillInTheBlank(Solved solved, List<ProblemAnswer> answers) {
        Map<Integer, Integer> solve = solved.getSolve();

        if (solve == null) {
            return false;
        }

        return answers.stream().allMatch(answer ->
            solve.containsKey(answer.getBlankPosition()) &&
                solve.get(answer.getBlankPosition()).equals(answer.getCorrectChoice().getChoiceId())
        );
    }

    private int calculateScore(int streakCount, int submitTime) {
        if (submitTime > MAX_SUBMIT_TIME) {
            throw new BusinessException(submitTime, "submitTime", ErrorCode.SUBMIT_TIME_EXCEEDED);
        }

        return BASE_SCORE * (MAX_SUBMIT_TIME - submitTime) + (streakCount * STREAK_BONUS);
    }

    public void resetSubmits(String roomId) {

        MultiGameRoom room = findOneById(roomId);

        room.getSubmits().forEach(submitItem -> submitItem.setIsSubmit(false));
    }
}
