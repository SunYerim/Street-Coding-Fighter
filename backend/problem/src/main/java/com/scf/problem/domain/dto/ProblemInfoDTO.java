package com.scf.problem.domain.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProblemInfoDTO {

    private Long problemId;

    private String title;

    private Integer type;

    private String category;

    private Integer difficulty;

    private ProblemContentDTO problemContent;

    private List<ProblemChoiceDTO> problemChoices;

    private List<ProblemAnswerDTO> problemAnswers;
}
