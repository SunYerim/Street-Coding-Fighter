package com.scf.multi.application;

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
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MultiGameService {

    private final MultiGameRepository multiGameRepository;
    private final ProblemService problemService;

    public List<RoomResponse.ListDTO> findAllRooms() {
        List<MultiGameRoom> rooms = multiGameRepository.findAllRooms();

        return rooms.stream().map(room ->
            RoomResponse.ListDTO.builder()
                .roomId(room.getRoomId())
                .title(room.getTitle())
                .hostname(room.getHostname())
                .maxPlayer(room.getMaxPlayer())
                .curPlayer(room.getPlayers().size())
                .isLock(room.getPassword() != null)
                .build()
        ).toList();
    }

    public MultiGameRoom findOneById(String roomId) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);

        if (room == null) {
            throw new BusinessException(roomId, "roomId", ErrorCode.ROOM_NOT_FOUND);
        }

        return room;
    }

    public String createRoom(Long userId, String username, CreateRoomDTO createRoomDTO) {

        String roomId = UUID.randomUUID().toString();

        MultiGameRoom room = MultiGameRoom.builder()
            .roomId(roomId)
            .hostId(userId)
            .hostname(username)
            .title(createRoomDTO.getTitle())
            .maxPlayer(createRoomDTO.getMaxPlayer())
            .password(createRoomDTO.getPassword())
            .playRound(createRoomDTO.getGameRound())
            .build();

        Player hostPlayer = Player.builder()
            .userId(userId)
            .username(username)
            .isHost(true)
            .streakCount(0)
            .build();

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

        MultiGameRoom room = multiGameRepository.findOneById(roomId);

        boolean isHost = room.getHostId().equals(userId);

        Player player = Player.builder()
            .userId(userId)
            .username(username)
            .isHost(isHost)
            .streakCount(0)
            .build();
        room.add(roomPassword, player);
    }

    public void exitRoom(String roomId, Long userId) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);

        if (room == null) {
            throw new BusinessException(roomId, "roomId", ErrorCode.ROOM_NOT_FOUND);
        }

        room.remove(userId);
    }

    public int markSolution(String roomId, Player player, Solved solved) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);
        List<Problem> problems = room.getProblems();
        Problem problem = problems.get(room.getRound());

        if (problem == null) {
            throw new BusinessException(null, "problem", ErrorCode.PROBLEM_NOT_FOUND);
        }

        // 문제의 정답 가져오기
        List<ProblemAnswer> answers = problem.getProblemAnswers();
        ProblemType problemType = problem.getProblemType();

        // 점수 계산
        boolean isCorrect = compareWith(problemType, solved, answers);
        int score = 0;
        if (isCorrect) {
            score = calculateScore(player.getStreakCount(), solved.getSubmitTime());
        }

        room.updateScoreBoard(player.getUserId(), score);
        room.updateLeaderBoard(player.getUserId(), score);

        return score;
    }

    public List<ProblemResponse.ListDTO> startGame(String roomId, Long userId) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);

        if (room == null) {
            throw new BusinessException(roomId, "roomId", ErrorCode.ROOM_NOT_FOUND);
        }

        List<Problem> problems = problemService.getProblems(room.getPlayRound());

        if (problems == null || problems.isEmpty()) {
            throw new BusinessException(null, "problems", ErrorCode.PROBLEM_NOT_FOUND);
        }

        room.gameStart(problems, userId);

        // problem -> problemList
        return problems.stream()
            .map(problem -> ProblemResponse.ListDTO.builder()
                .problemId(problem.getProblemId())
                .title(problem.getTitle())
                .problemType(problem.getProblemType())
                .category(problem.getCategory())
                .difficulty(problem.getDifficulty())
                .problemContent(problem.getProblemContent())
                .problemChoices(problem.getProblemChoices())
                .build())
            .toList();
    }

    public Solved makeSolved(MultiGameRoom room, Long userId, Content content) {

        List<Problem> problems = room.getProblems();
        Problem problem = problems.get(room.getRound());

        return Solved
            .builder()
            .userId(userId)
            .problemId(problem.getProblemId())
            .solve(content.getSolve())
            .solveText(content.getSolveText())
            .submitTime(content.getSubmitTime())
            .build();
    }

    private boolean compareWith(ProblemType problemType, Solved solved,
        List<ProblemAnswer> answers) {

        switch (problemType) {
            case MULTIPLE_CHOICE -> { // 객관식

                Map<Integer, Integer> solve = solved.getSolve();

                ProblemChoice correctChoice = answers.getFirst().getCorrectChoice();

                if (!correctChoice.getChoiceId().equals(solve.get(1))) {
                    return false;
                }
            }
            case SHORT_ANSWER_QUESTION -> { // 주관식

                String correctAnswerText = answers.getFirst().getCorrectAnswerText();

                if (!correctAnswerText.equals(solved.getSolveText())) {
                    return false;
                }
            }
            case FILL_IN_THE_BLANK -> { // 빈칸 채우기

                Map<Integer, Integer> solve = solved.getSolve();

                for (ProblemAnswer answer : answers) {

                    int blankNum = answer.getBlankPosition();

                    if (!solve.containsKey(blankNum)) {
                        return false;
                    }

                    int selectedChoiceId = solve.get(blankNum);
                    int correctChoiceId = answer.getCorrectChoice().getChoiceId();

                    if (selectedChoiceId != correctChoiceId) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    private int calculateScore(int streakCount, int submitTime) {

        if (submitTime > 30) {
            throw new BusinessException(submitTime, "submitTime", ErrorCode.SUBMIT_TIME_EXCEEDED);
        }

        int score = 1000 * (30 - submitTime);
        score += (streakCount * 75);

        return score;
    }
}
