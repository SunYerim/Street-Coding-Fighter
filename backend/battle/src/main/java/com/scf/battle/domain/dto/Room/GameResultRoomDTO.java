package com.scf.battle.domain.dto.Room;

import com.scf.battle.domain.enums.GameResultType;
import com.scf.battle.domain.enums.GameType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class GameResultRoomDTO {
    private GameType gameType;
    private LocalDateTime gameDateTime;
    private Long playerAId;
    private Long playerBId;
    private GameResultType result;

    public int getGameType() {
        return gameType.getValue();
    }

    public int getResult() {
        return result.getValue();
    }
}