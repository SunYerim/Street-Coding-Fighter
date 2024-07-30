package com.scf.rank.domain.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserExp {

    private Long userId;
    private int exp;
}
