package com.scf.battle.application;

import com.scf.battle.domain.dto.Problem.Problem;
import com.scf.battle.domain.dto.Problem.ProblemAnswer;
import com.scf.battle.domain.dto.Problem.ProblemChoice;
import com.scf.battle.domain.dto.User.FightDTO;
import com.scf.battle.domain.dto.User.Solved;
import com.scf.battle.domain.enums.ProblemType;
import com.scf.battle.domain.model.BattleGameRoom;
import com.scf.battle.domain.repository.BattleGameRepository;
import com.scf.battle.global.error.ErrorCode;
import com.scf.battle.global.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameService {

    private final BattleGameRepository battleGameRepository;
    private final ProblemService problemService;

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

    public FightDTO markSolution(String roomId, Long userId, Solved solved) {
        BattleGameRoom room = battleGameRepository.findById(roomId);
        if (room == null) {
            throw new BusinessException(roomId, "roomId", ErrorCode.ROOM_NOT_FOUND);
        }
        List<Problem> problems = room.getProblemsForRound(solved.getRound());
        if (problems == null || problems.isEmpty()) {
            throw new BusinessException(String.valueOf(solved.getRound()), "round", ErrorCode.NO_PROBLEM_FOR_ROUND);
        }
        Optional<Problem> problemOpt = problems.stream()
                .filter(p -> p.getProblemId().equals(solved.getProblemId()))
                .findFirst();
        if (!problemOpt.isPresent()) {
            throw new BusinessException(solved.getProblemId().toString(), "problemId", ErrorCode.PROBLEM_NOT_FOUND);
        }
        Problem problem = problemOpt.get();
        List<ProblemAnswer> answers = problem.getProblemAnswers();
        ProblemType problemType = problem.getProblemType();

        boolean isCorrect = compareAnswers(problemType, solved, answers);
        int score = isCorrect ? calculateScore(solved.getSubmitTime()) : 0;
        room.updateHp(userId, score);
        return FightDTO.builder().userId(userId).isAttack(isCorrect).power(score).build();
    }

    private boolean compareAnswers(ProblemType problemType, Solved solved, List<ProblemAnswer> answers) {
        switch (problemType) {
            case MULTIPLE_CHOICE:
                return compareMultipleChoiceAnswers(solved, answers);
            case SHORT_ANSWER_QUESTION:
                return compareShortAnswer(solved, answers);
            case FILL_IN_THE_BLANK:
                return compareFillInTheBlank(solved, answers);
            default:
                throw new IllegalArgumentException("Unknown ProblemType: " + problemType);
        }
    }

    private boolean compareMultipleChoiceAnswers(Solved solved, List<ProblemAnswer> answers) {
        Map<Integer, Integer> solve = solved.getSolve();
        ProblemChoice correctChoice = answers.get(0).getCorrectChoice();
        return correctChoice.getChoiceId().equals(solve.get(1));
    }

    private boolean compareShortAnswer(Solved solved, List<ProblemAnswer> answers) {
        String correctAnswerText = answers.get(0).getCorrectAnswerText();
        return correctAnswerText.equals(solved.getSolveText());
    }

    private boolean compareFillInTheBlank(Solved solved, List<ProblemAnswer> answers) {
        Map<Integer, Integer> solve = solved.getSolve();
        for (ProblemAnswer answer : answers) {
            int blankNum = answer.getBlankPosition();
            if (!solve.containsKey(blankNum) || !solve.get(blankNum).equals(answer.getCorrectChoice().getChoiceId())) {
                return false;
            }
        }
        return true;
    }

    public boolean isRoundOver(String roomId) {
        BattleGameRoom room = battleGameRepository.findById(roomId);
        return room.getHasPlayerASubmitted() && room.getHasPlayerBSubmitted() && room.nextRound() != null;
    }

    public List<Problem> getCurrentRoundProblem(String roomId, Integer currentRound) {
        BattleGameRoom room = battleGameRepository.findById(roomId);
        return room.getProblemsForRound(currentRound);
    }

    public int calculateScore(Integer submitTime) {
        if (submitTime > 30) {
            throw new BusinessException(String.valueOf(submitTime), "submitTime", ErrorCode.SUBMIT_TIME_EXCEEDED);
        }
        int initialScore = 20;
        double decrementPerSecond = 0.3333;
        return Math.max((int) (initialScore - (submitTime * decrementPerSecond)), 0);
    }
}
