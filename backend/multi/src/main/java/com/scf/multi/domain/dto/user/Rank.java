package com.scf.multi.domain.dto.user;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Rank {

    private Long userId;
    private String username;
    private int score;
}
