package com.scf.battle.domain.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class JoinRoomDTO {

    private Long userId;
    private String username;
    private String roomPassword;

}
