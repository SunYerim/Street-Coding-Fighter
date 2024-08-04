package com.scf.battle.domain.enums;

public enum GameType {
    MULTI(0),
    BATTLE(1);

    private final int value;

    GameType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}