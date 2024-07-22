package com.scf.battle.domain.model;

import com.scf.battle.domain.dto.Player;
import org.springframework.beans.factory.parsing.Problem;

import java.util.*;

public class BattleGameRoom {
    private String roomId;
    private Long hostId;
    private String title;
    private String password;
    private Integer maxPlayer;

    private final List<Problem> problems = new ArrayList<>();
    private final List<Player> players = Collections.synchronizedList(new ArrayList<>());
    private final Map<Long, Integer> scoreBoard = Collections.synchronizedMap(new HashMap<>()); // player, score
    private Boolean isStart;
    private Integer round;


}
