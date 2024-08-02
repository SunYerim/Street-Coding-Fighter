package com.scf.multi.domain.dto.user;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class RoundRank {

    private Long userId;
    private String username;
    private int score;
    private int rank;

    @Builder
    public RoundRank(Long userId, String username, Integer score, Integer rank) {
        this.userId = userId;
        this.username = username;
        this.score = score;
        this.rank = rank;
    }
}
