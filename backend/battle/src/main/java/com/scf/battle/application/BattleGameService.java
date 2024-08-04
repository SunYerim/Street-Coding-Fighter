package com.scf.battle.application;

import com.scf.battle.domain.dto.Problem.*;
import com.scf.battle.domain.dto.Room.CreateRoomDTO;
import com.scf.battle.domain.dto.User.FightDTO;
import com.scf.battle.domain.dto.User.Player;
import com.scf.battle.domain.dto.User.Solved;
import com.scf.battle.domain.enums.ProblemType;
import com.scf.battle.domain.model.BattleGameRoom;
import com.scf.battle.domain.repository.BattleGameRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import com.scf.battle.global.error.ErrorCode;
import com.scf.battle.global.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BattleGameService {

    private final BattleGameRepository battleGameRepository;
    private final ProblemService problemService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<BattleGameRoom> findAllRooms() {
        return battleGameRepository.findAllRooms();
    }

    public BattleGameRoom findById(String roomId) {
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

    public String createRoom(Long memberId, String username, CreateRoomDTO createRoomDTO) {
        String roomId = UUID.randomUUID().toString();

        Player playerHost = new Player(memberId, username, 100);
        BattleGameRoom room = BattleGameRoom.builder()
                .roomId(roomId)
                .hostId(memberId)
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
            throw new BusinessException(roomId, "roomId", ErrorCode.ROOM_NOT_FOUND);
        }
        if (room.getIsStart()) {
            throw new BusinessException(roomId, "roomId", ErrorCode.GAME_ALREADY_STARTED);
        }
        List<Problem> problems = problemService.getProblems(room.getFinalRound() * 3);
        if (problems.isEmpty()) {
            throw new BusinessException(room, "roomId", ErrorCode.PROBLEM_NOT_FOUND);
        }
        room.startGame(problems, userId);

        return problems;
    }

    public int calculateScore(Integer submitTime) { // TODO: 협의 후 수정
        if (submitTime > 30) { // 예외처리고, 실제로는 30초가 딱 되면
            throw new BusinessException(String.valueOf(submitTime), "submitTime", ErrorCode.SUBMIT_TIME_EXCEEDED);
        }
        int initialScore = 20; // TODO : 알고리즘 추가 log
        double decrementPerSecond = 0.3333;
        int power = (int) (initialScore - (submitTime * decrementPerSecond));
        if (power < 0) power = 0;
        return power;
    }

    public FightDTO markSolution(String roomId, Long userId, Solved solved) {
        BattleGameRoom room = battleGameRepository.findById(roomId);
        if (room == null) {
            throw new BusinessException(roomId, "roomId", ErrorCode.ROOM_NOT_FOUND);
        }

        // 해당 라운드 문제 가져오기
        List<Problem> problems = room.getProblemsForRound(solved.getRound());
        if (problems == null || problems.isEmpty()) {
            throw new BusinessException(String.valueOf(solved.getRound()), "round", ErrorCode.NO_PROBLEM_FOR_ROUND);
        }

        // 해당 라운드에서 유저가 선택한 문제 추출
        Optional<Problem> problemOpt = problems.stream()
                .filter(p -> p.getProblemId().equals(solved.getProblemId()))
                .findFirst();
        if (!problemOpt.isPresent()) {
            throw new BusinessException(solved.getProblemId().toString(), "problemId", ErrorCode.PROBLEM_NOT_FOUND);
        }
        //추출한 문제 : problem
        Problem problem = problemOpt.get();

        // 문제의 정답 가져오기
        List<ProblemAnswer> answers = problem.getProblemAnswers();
        ProblemType problemType = problem.getProblemType();

        boolean isCorrect = compareAnswers(problemType, solved, answers);
        int score = 0;
        if (isCorrect) { //맞은 경우
            System.out.println("correct");
            score = calculateScore(solved.getSubmitTime());
            room.updateHp(userId, score);
            return FightDTO.builder().userId(userId).isAttack(true).power(score).build();
        }
        room.updateHp(userId, score);
        return FightDTO.builder().userId(userId).isAttack(false).power(score).build();
    }

    private boolean compareAnswers(ProblemType problemType, Solved solved, List<ProblemAnswer> answers) {
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

    public boolean isRoundOver(String roomId) {
        BattleGameRoom room = findById(roomId);
        if (room.getHasPlayerASubmitted() && room.getHasPlayerBSubmitted()) {
            Integer currentRound = room.nextRound(); // TODO:이 부분 생각하기
            return true;
        }
        return false;
    }


    public Integer runRound(String roomId) {
        BattleGameRoom room = findById(roomId);
        Integer currentRound = room.nextRound();
        if (currentRound == -1) { // 라운드 끝인 상황

        }
        return currentRound;
    }

    public List<Problem> getCurrentRoundProblem(String roomId, Integer currentRound) {
        BattleGameRoom room = findById(roomId);
        List<Problem> currentRoundProblem = room.getProblemsForRound(currentRound);
        return currentRoundProblem;
    }
}
