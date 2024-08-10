package com.scf.battle.domain.dto.Room;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomResponseDTO {
    private String roomId;
    private String title;
    private Long hostId;
    private Integer maxPlayer;
    private Integer curPlayer;
    private Boolean isLock;
}
