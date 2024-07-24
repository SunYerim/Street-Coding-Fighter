package com.scf.multi.domain.dto.problem;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProblemInfo {

    private Long problemId;
    private Integer type;
    private String category;
    private String title;
    private String content;
}
