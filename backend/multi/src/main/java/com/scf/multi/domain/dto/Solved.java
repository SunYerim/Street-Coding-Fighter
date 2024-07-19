package com.scf.multi.domain.dto;

import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Solved {

    private final Long problemId;
    private final Long userId;
    private final Map<Integer, Integer> solve;
    private final Integer submitTime;

    public boolean mark(Problem problem) {

//        // 문제의 정답 가져오기
//        Map<Integer, Integer> answer = problem.getAnswer();
//
//        // 점수를 계산할 변수
//        int score = 0;
//
//        // 제출된 답안과 문제의 정답을 비교
//        for (Map.Entry<Integer, Integer> entry : solve.entrySet()) {
//            Integer blankNumber = entry.getKey(); // 빈칸 번호
//            Integer submittedOption = entry.getValue(); // 제출된 보기 번호
//
//            // 정답의 빈칸 번호에 해당하는 보기 번호와 비교
//            if (answer.containsKey(blankNumber) && answer.get(blankNumber).equals(submittedOption)) {
//                score++;
//            }
//        }
//
//        return score;

        return true; // TODO: 추후 문제/정답 형식에 따라 수정
    }
}
