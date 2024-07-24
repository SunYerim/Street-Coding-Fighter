package com.scf.battle.domain.model;

import com.scf.battle.domain.dto.JoinRoomDTO;
import com.scf.battle.domain.dto.Player;
import com.scf.battle.domain.dto.Problem;
import lombok.Builder;
import lombok.Getter;

import java.util.*;


@Builder
@Getter
public class BattleGameRoom {

    private String roomId;
    private Long hostId;
    private String title;
    private String password;

    private final List<List<Problem>> roundProblems = new ArrayList<>(); // 라운드 마다 3문제로 나누기 위함
    private final List<Player> players = Collections.synchronizedList(new ArrayList<>());
    private final Map<Long, Integer> scoreBoard = Collections.synchronizedMap(
        new HashMap<>()); // player, score
    private Boolean isStart;
    private Integer round;

    public void add(JoinRoomDTO joinRoomDto) {
        Long userId = joinRoomDto.getUserId();
        String username = joinRoomDto.getUsername();
        String roomPassword = joinRoomDto.getRoomPassword();

        if (roomPassword.equals(this.password)) {
            players.add(new Player(userId, username));
        } else {
            // 예외처리
        }
    }

    public void startGame(List<Problem> problems, Long userId) {
        if(!this.hostId.equals(userId)){ //방장이 아닐 때
            //예외처리
        }
        if(this.players.size() < 2){ // 2명보다 작을 때
            //예외처리
        }
        if (problems == null || problems.isEmpty()) { // 문제에 대한 예외처리
            //예외처리
        }
        this.problems.addAll(problems);
        this.isStart = true;
    }

}
