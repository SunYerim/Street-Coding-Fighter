package com.scf.multi.application;

import com.scf.multi.domain.dto.problem.Problem;
import com.scf.multi.domain.dto.problem.ProblemAnswer;
import com.scf.multi.domain.dto.problem.ProblemChoice;
import com.scf.multi.domain.dto.problem.ProblemResponse;
import com.scf.multi.domain.dto.problem.ProblemType;
import com.scf.multi.domain.dto.room.CreateRoomDTO;
import com.scf.multi.domain.dto.room.RoomRequest;
import com.scf.multi.domain.dto.room.RoomRequest.ListDTO;
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

    public List<RoomRequest.ListDTO> findAllRooms() {
        List<MultiGameRoom> rooms = multiGameRepository.findAllRooms();

        return rooms.stream().map(room ->
            ListDTO.builder()
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

        // 점수를 계산할 변수
        boolean isCorrect = compareWith(problemType, solved, answers);

        if (isCorrect) {
            int score = calculateScore(player.getStreakCount(), solved.getSubmitTime());
            room.updateScore(player.getUserId(), score);
            return score;
        }

        return 0;
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

    private boolean compareWith(ProblemType problemType, Solved solved,
        List<ProblemAnswer> answers) {

        switch (problemType) {
            case ProblemType.MULTIPLE_CHOICE -> { // 객관식

                Map<Integer, Integer> solve = solved.getSolve();

                ProblemChoice correctChoice = answers.getFirst().getCorrectChoice();

                if (!correctChoice.getChoiceId().equals(solve.get(1))) {
                    return false;
                }
            }
            case ProblemType.SHORT_ANSWER_QUESTION -> { // 주관식

                String correctAnswerText = answers.getFirst().getCorrectAnswerText();

                if (!correctAnswerText.equals(solved.getSolveText())) {
                    return false;
                }
            }
            case ProblemType.FILL_IN_THE_BLANK -> { // 빈칸 채우기

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

        int score = 1000 * (submitTime / 30);
        score += (streakCount * 75);

        return score;
    }
}
