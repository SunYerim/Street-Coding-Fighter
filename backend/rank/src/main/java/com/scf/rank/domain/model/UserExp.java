package com.scf.rank.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class UserExp {

    @Builder
    public UserExp(Long userId, Integer exp) {
        this.userId = userId;
        this.exp = exp;
    }

    private Long userId;
    private int exp;
}
