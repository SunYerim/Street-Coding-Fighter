package com.scf.multi.domain.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Player {

    private Long userId;
    private String username;
    private Boolean isHost;
    private Integer streakCount;
}
