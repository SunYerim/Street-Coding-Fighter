package com.scf.battle.domain.dto.Problem;

import java.util.List;

import com.scf.battle.domain.enums.ProblemType;
import lombok.Builder;
import lombok.Data;

public class ProblemResponse {

    @Data
    @Builder
    public static class ListDTO {

        private Long problemId;
        private String title;
        private ProblemType problemType;
        private String category;
        private Integer difficulty;
//        private ProblemContent problemContent;
//        private List<ProblemChoice> problemChoices;
    }

    @Data
    @Builder
    public static class SelectProblemDTO {

        private Long problemId;
        private String title;
        private ProblemType problemType;
        private String category;
        private Integer difficulty;
        private ProblemContent problemContent;
        private List<ProblemChoice> problemChoices;
    }
}
