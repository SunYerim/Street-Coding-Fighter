package com.scf.battle.domain.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoinRoomRequestDTO {

    private String roomId;
    private Long userId;
    private String username;
    private String roomPassword;
}
