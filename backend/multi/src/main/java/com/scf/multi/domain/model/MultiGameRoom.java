package com.scf.multi.domain.model;

import com.scf.multi.domain.dto.Player;
import com.scf.multi.domain.dto.Problem;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MultiGameRoom {

    private final List<Problem> problems = new ArrayList<>();
    private final List<Player> players = Collections.synchronizedList(new ArrayList<>());
    private String roomId;
    private Long hostId;
    private Boolean isStart;
    
    public List<Player> getPlayers() {
        // 읽기 전용 List 반환
        return Collections.unmodifiableList(players);
    }

    public List<Problem> getProblems() {
        // 읽기 전용 List 반환
        return Collections.unmodifiableList(this.problems);
    }

    public void add(Long userId, String username) {
        this.players.add(new Player(userId, username));
    }

    public void remove(Long userId) {
        this.players.removeIf(player -> player.getUserId().equals(userId));
    }

    public void gameStart(List<Problem> problems) {
        this.problems.addAll(problems);
        this.isStart = true;
    }
}
