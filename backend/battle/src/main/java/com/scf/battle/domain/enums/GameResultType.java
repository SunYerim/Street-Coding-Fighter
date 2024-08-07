package com.scf.battle.domain.enums;

import lombok.Getter;

@Getter
public enum GameResultType {
    DRAW(0),
    PLAYER_A_WINS(1),
    PLAYER_B_WINS(2);

    private final int value;

    GameResultType(int value) {
        this.value = value;
    }

}