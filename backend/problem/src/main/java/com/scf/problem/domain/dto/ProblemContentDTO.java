package com.scf.problem.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProblemContentDTO {

    private Long problemId;

    private String content;

    private Integer numberOfBlanks;
}
