package com.scf.rank.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class UserExp {

    @Builder
    public UserExp(Long userId, String name, Integer exp) {
        this.userId = userId;
        this.name = name;
        this.exp = exp;
    }

    private Long userId;
    private String name;
    private int exp;
}
