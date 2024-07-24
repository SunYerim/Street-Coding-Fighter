package com.scf.battle.domain.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FightDTO {

    private Long userId;
    private Boolean isAttack;
    private Integer power;
}
