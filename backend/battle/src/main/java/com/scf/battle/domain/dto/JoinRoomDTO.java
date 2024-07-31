package com.scf.battle.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoinRoomDTO {

    private String roomId;
    private Long userId;
    private String username;
    private String roomPassword;
}
