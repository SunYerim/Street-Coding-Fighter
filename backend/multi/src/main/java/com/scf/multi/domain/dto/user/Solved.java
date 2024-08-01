package com.scf.multi.domain.dto.user;

import java.util.Map;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class Solved {

    private Long problemId;
    private Long userId;
    private Map<Integer, Integer> solve;
    private String solveText;
    private Integer submitTime;

    @Builder
    public Solved(Long problemId, Long userId, Map<Integer, Integer> solve, String solveText, Integer submitTime) {
        this.problemId = problemId;
        this.userId = userId;
        this.solve = solve;
        this.solveText = solveText;
        this.submitTime = submitTime;
    }
}
