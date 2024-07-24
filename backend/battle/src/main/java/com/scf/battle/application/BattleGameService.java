package com.scf.battle.application;

import com.scf.battle.domain.dto.CreateRoomDTO;
import com.scf.battle.domain.dto.JoinRoomDTO;
import com.scf.battle.domain.dto.Problem;
import com.scf.battle.domain.dto.Solved;
import com.scf.battle.domain.model.BattleGameRoom;
import com.scf.battle.domain.repository.BattleGameRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BattleGameService {

    private final BattleGameRepository battleGameRepository;
    private final ProblemService problemService;

    public List<BattleGameRoom> findAllRooms() {
        return battleGameRepository.findAllRooms();
    }

    public BattleGameRoom findById(String roomId) {
        // TODO : room이 null일 때
        return battleGameRepository.findById(roomId);
    }

    public void joinRoom(String roomId, JoinRoomDTO joinRoomDto) {
        battleGameRepository.joinRoom(roomId, joinRoomDto);
    }

    public String createRoom(Long userId, CreateRoomDTO createRoomDTO) {
        String roomId = UUID.randomUUID().toString();

        BattleGameRoom room = BattleGameRoom.builder()
            .roomId(roomId)
            .hostId(userId)
            .isStart(false)
            .round(0)
            .title(createRoomDTO.getTitle())
            .password(createRoomDTO.getPassword())
            .build();

        battleGameRepository.addRoom(room);
        return roomId;
    }

    public List<Problem> startGame(Long userId, String roomId) {
        BattleGameRoom room = battleGameRepository.findById(roomId);

        if (room == null) {
            // 예외처리
        }

        List<Problem> problems = problemService.getProblem();

        room.startGame(problems, userId);

        return problems;
    }

    private int calculateScore(int submitTime) { // TODO: 협의 후 수정

        if (submitTime > 30) {
            // TODO : 예외처리 30초 보다 많은 경우
        }

        int[] times = {3, 6, 9, 12, 15};
        int[] scores = {500, 300, 200, 150, 130};

        for (int i = 0; i < times.length; i++) {
            if (submitTime < times[i]) {
                return scores[i];
            }
        }
        return 50;
    }

    public int markSolution(String roomId, Long userId, Solved solved) {

        BattleGameRoom room = battleGameRepository.findById(roomId);
        //라운드 별 문제 가져오기
        List<Problem> problems = room.getProblemsForRound(room.getRound());
        //해당 라운드에서 유저가 선택한 문제 추출
        Optional<Problem> problemOpt = problems.stream()
            .filter(p -> p.getProblemId().equals(solved.getProblemId()))
            .findFirst();

        if (!problemOpt.isPresent()) {
            // TODO : 문제가 없는 경우
        }
        //추출한 문제 : problem
        Problem problem = problemOpt.get();

        // 문제의 정답 가져오기
        Map<Integer, Integer> answer = problem.getAnswer();

        // 제출된 답안과 문제의 정답을 비교하기
        int correctAnswerCount = compareAnswers(answer, solved.getSolve());

        if (correctAnswerCount > 0) {
            int score = calculateScore(solved.getSubmitTime());
            room.updateScore(userId, score);
            return score;
        }

        return 0;
    }

}
