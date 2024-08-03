package com.scf.multi.domain.model;

import lombok.Builder;
import lombok.Getter;

@Getter
public class Player {

    private final Long userId;
    private final String username;
    private Boolean isHost;
    private Integer streakCount;

    @Builder
    public Player(Long userId, String username, Boolean isHost, Integer streakCount) {
        this.userId = userId;
        this.username = username;
        this.isHost = isHost;
        this.streakCount = streakCount;
    }

    public void setHost() {
        this.isHost = true;
    }
}
