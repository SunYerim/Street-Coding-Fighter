package com.scf.multi.application;

import com.scf.multi.domain.dto.Problem;
import com.scf.multi.domain.dto.Solved;
import com.scf.multi.domain.model.MultiGameRoom;
import com.scf.multi.domain.repository.MultiGameRepository;
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

    public List<MultiGameRoom> findAllRooms() {
        return multiGameRepository.findAllRooms();
    }

    public MultiGameRoom findOneById(String roomId) {
        return multiGameRepository.findOneById(roomId);
    }

    public String createRoom(Long userId) {

        String roomId = UUID.randomUUID().toString();

        MultiGameRoom room = MultiGameRoom.builder()
            .roomId(roomId)
            .hostId(userId)
            .isStart(false)
            .round(0)
            .build();

        multiGameRepository.addRoom(room);
        return roomId;
    }

    public void deleteRoom(String roomId) {
        multiGameRepository.deleteRoom(roomId);
    }

    public void joinRoom(String roomId, Long userId, String username) {
        multiGameRepository.joinRoom(roomId, userId, username);
    }

    public void exitRoom(String roomId, Long userId) {
        multiGameRepository.exitRoom(roomId, userId);
    }

    public int markSolution(String roomId, Long userId, Solved solved) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);
        List<Problem> problems = room.getProblems();
        Problem problem = problems.get(room.getRound());

        // 문제의 정답 가져오기
        Map<Integer, Integer> answer = problem.getAnswer();

        // 점수를 계산할 변수
        int correctAnswerCount = 0;

        // 제출된 답안과 문제의 정답을 비교
        Map<Integer, Integer> solve = solved.getSolve();
        for (Map.Entry<Integer, Integer> entry : solve.entrySet()) {
            Integer blankNumber = entry.getKey(); // 빈칸 번호
            Integer submittedOption = entry.getValue(); // 제출된 보기 번호

            // 정답의 빈칸 번호에 해당하는 보기 번호와 비교
            if (answer.containsKey(blankNumber) && answer.get(blankNumber)
                .equals(submittedOption)) {
                correctAnswerCount++;
            }
        }

        if (correctAnswerCount > 0) {
            int score = calculateScore(solved.getSubmitTime());
            room.updateScore(userId, score);
            return score;
        }

        return 0;
    }

    public List<Problem> startGame(String roomId) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);

        List<Problem> problems = problemService.getProblems();

        room.gameStart(problems);

        return problems;
    }

    private int calculateScore(int submitTime) { // TODO: 협의 후 수정

        if (submitTime < 3) {
            return 500;
        } else if (submitTime < 6) {
            return 300;
        } else if (submitTime < 9) {
            return 200;
        } else if (submitTime < 12) {
            return 150;
        } else if (submitTime < 15) {
            return 130;
        }
        return 50;
    }
}
