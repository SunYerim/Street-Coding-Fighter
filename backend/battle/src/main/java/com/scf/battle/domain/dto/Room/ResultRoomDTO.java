package com.scf.battle.domain.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Map;

@Data
@AllArgsConstructor
public class ResultRoomDTO {
    private Map<String, Long> result;

}
