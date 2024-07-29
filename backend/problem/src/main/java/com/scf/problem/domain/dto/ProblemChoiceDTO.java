package com.scf.problem.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProblemChoiceDTO {

    private Integer choiceId;

    private Integer problemId;

    private String choiceText;
}
