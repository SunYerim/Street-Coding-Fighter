package com.scf.battle.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SelectProblemDTO {
    private Long problemId;
    private Integer type;
    private String title;
}
