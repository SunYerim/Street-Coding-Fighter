package com.scf.battle.application;

import com.scf.battle.domain.dto.Problem.Problem;
import com.scf.battle.domain.dto.Problem.ProblemAnswer;
import com.scf.battle.domain.dto.Problem.ProblemChoice;
import com.scf.battle.domain.dto.Problem.ProblemType;
import com.scf.battle.domain.dto.Room.CreateRoomDTO;
import com.scf.battle.domain.dto.User.FightDTO;
import com.scf.battle.domain.dto.User.Player;
import com.scf.battle.domain.dto.User.Solved;
import com.scf.battle.domain.model.BattleGameRoom;
import com.scf.battle.domain.repository.BattleGameRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.scf.battle.global.error.ErrorCode;
import com.scf.battle.global.error.exception.BusinessException;
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

    public void joinRoom(String roomId, Long userId, String username, String roomPassword) {
        BattleGameRoom room = battleGameRepository.findById(roomId);

        if (room == null) {
            throw new BusinessException(roomId, "roomId", ErrorCode.ROOM_NOT_FOUND);
        }

        if (room.getPlayerB() != null && room.getPlayerB().getUserId() != null) {
            throw new BusinessException(roomId, "roomId", ErrorCode.MAX_PLAYERS_EXCEEDED);
        }

        if (room.getPassword() != null && !room.getPassword().equals(roomPassword)) {
            throw new BusinessException(roomPassword, "roomPassword", ErrorCode.PASSWORD_MISMATCH);
        }
        battleGameRepository.joinRoom(roomId, userId, username, roomPassword);
    }

    public String createRoom(Long userId, CreateRoomDTO createRoomDTO) {
        String roomId = UUID.randomUUID().toString();

        Player playerHost = new Player(userId,createRoomDTO.getUsername(),100);
        BattleGameRoom room = BattleGameRoom.builder()
            .roomId(roomId)
            .hostId(userId)
            .isStart(false)
            .finalRound(createRoomDTO.getRound())
            .title(createRoomDTO.getTitle())
            .password(createRoomDTO.getPassword())
            .playerA(playerHost)
            .hasPlayerASubmitted(false)
            .hasPlayerBSubmitted(false)
            .isAttack(false)
            .currentRound(0)
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

    private int calculatePower(int submitTime) { // TODO: 협의 후 수정

        if (submitTime > 30) {
            // TODO : 예외처리 30초 보다 많은 경우
        }
        int power = 10-submitTime;
        if(power < 0) power = 0;
        return power;
    }

    public FightDTO markSolution(String roomId, Long userId, Solved solved) {
        BattleGameRoom room = battleGameRepository.findById(roomId);
        //해당 라운드 문제 가져오기
        List<Problem> problems = room.getProblemsForRound(solved.getRound());
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
        int score = 0;
        if (correctAnswerCount > 0) { // 맞추었다면
            score = calculatePower(solved.getSubmitTime());
            room.updateHp(userId, score);
            return FightDTO.builder().userId(userId).isAttack(true).power(score).build();
        }
        return FightDTO.builder().userId(userId).isAttack(false).power(0).build();
    }

    private int compareAnswers(Map<Integer, Integer> answer, Map<Integer, Integer> solve) {
        int correctAnswerCount = 0;
        for (Map.Entry<Integer, Integer> entry : solve.entrySet()) {
            Integer blankNumber = entry.getKey(); // 빈칸 번호
            Integer submittedOption = entry.getValue(); // 제출된 보기 번호

            // 정답과 비교하여 맞춘 답안 개수 증가
            if (answer.containsKey(blankNumber) && answer.get(blankNumber)
                .equals(submittedOption)) {
                correctAnswerCount++;
            }
        }
        return correctAnswerCount;
    }

    public boolean isRoundOver(String roomId) {
        BattleGameRoom room = findById(roomId);
        if(room.getHasPlayerASubmitted() && room.getHasPlayerBSubmitted()) return true;
        return false;
    }


    public Integer runRound(String roomId) {
        BattleGameRoom room = findById(roomId);
        Integer currentRound = room.nextRound();
        if(currentRound == -1){ // 라운드 끝인 상황

        }
        return currentRound;
    }

    public List<Problem> getCurrentRoundProblem(String roomId, Integer currentRound){
        BattleGameRoom room = findById(roomId);
        List<Problem> currentRoundProblem = room.getProblemsForRound(currentRound);
        return currentRoundProblem;
    }
}
