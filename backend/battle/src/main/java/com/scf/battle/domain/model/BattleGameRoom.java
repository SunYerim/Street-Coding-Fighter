package com.scf.battle.domain.model;

import com.scf.battle.domain.dto.JoinRoomDTO;
import com.scf.battle.domain.dto.Player;
import lombok.Builder;
import lombok.Getter;
import org.springframework.beans.factory.parsing.Problem;

import java.util.*;

@Getter
@Builder
public class BattleGameRoom {
    private String roomId;
    private Long hostId;
    private String title;
    private String password;

    private final List<Problem> problems = new ArrayList<>();
    private final List<Player> players = Collections.synchronizedList(new ArrayList<>());
    private final Map<Long, Integer> scoreBoard = Collections.synchronizedMap(new HashMap<>()); // player, score
    private Boolean isStart;
    private Integer round;

    private List<Player> getPlayers(){
        return Collections.unmodifiableList(players);
    }

    public void add(JoinRoomDTO joinRoomDto) {
        Long userId = joinRoomDto.getUserId();
        String username = joinRoomDto.getUsername();
        String roomPassword = joinRoomDto.getRoomPassword();

        if(roomPassword.equals(this.password)){
            players.add(new Player(userId, username));
        }
        else{
            // 예외처리
        }
    }

}
