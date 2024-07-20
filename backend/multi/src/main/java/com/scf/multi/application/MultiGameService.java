package com.scf.multi.application;

import com.scf.multi.domain.dto.Problem;
import com.scf.multi.domain.dto.Solved;
import com.scf.multi.domain.dto.message.Content;
import com.scf.multi.domain.model.MultiGameRoom;
import com.scf.multi.domain.repository.MultiGameRepository;
import com.scf.multi.domain.repository.SolvedRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MultiGameService {

    private final MultiGameRepository multiGameRepository;
    private final ProblemService problemService;
    private final SolvedRepository solvedRepository;

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

    public int markSolution(String roomId, Long userId, Content content) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);
        List<Problem> problems = room.getProblems();
        Problem problem = problems.get(room.getRound());

        Solved solved = Solved
            .builder()
            .userId(userId)
            .problemId(problem.getProblemId())
            .solve(content.getSolve())
            .submitTime(content.getSubmitTime())
            .build();

        solvedRepository.save(userId, solved);

        boolean isCorrect = solved.mark(problem);

        if (isCorrect) {
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
        } else if(submitTime < 9) {
            return 200;
        } else if(submitTime < 12) {
            return 150;
        } else if(submitTime < 15) {
            return 130;
        }
        return 50;
    }
}
