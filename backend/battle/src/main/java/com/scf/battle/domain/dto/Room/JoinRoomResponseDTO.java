package com.scf.battle.domain.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinRoomResponseDTO {
    private String username;
    private Long memberId;
    private Integer hostCharacterType;
}
