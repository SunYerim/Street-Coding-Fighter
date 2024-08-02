package com.scf.multi.domain.dto.user;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class GameRank {

    private Long userId;
    private String username;
    private Integer score;
    private Integer rank;

    @Builder
    public GameRank(Long userId, String username, Integer score, Integer rank) {
        this.userId = userId;
        this.username = username;
        this.score = score;
        this.rank = rank;
    }
}
