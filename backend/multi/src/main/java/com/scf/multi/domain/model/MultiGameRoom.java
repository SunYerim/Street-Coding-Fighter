package com.scf.multi.domain.model;

import com.scf.multi.domain.dto.Player;
import com.scf.multi.domain.dto.Problem;
import com.scf.multi.domain.dto.Rank;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MultiGameRoom {

    private final List<Problem> problems = new ArrayList<>();
    private final List<Player> players = Collections.synchronizedList(new ArrayList<>());
    private final Map<Long, Integer> scoreBoard = Collections.synchronizedMap(new HashMap<>());
    private String roomId;
    private Long hostId;
    private Boolean isStart;
    private Integer round;
    
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
        this.scoreBoard.put(userId, 0);
    }

    public void remove(Long userId) {
        this.players.removeIf(player -> player.getUserId().equals(userId));
    }

    public void gameStart(List<Problem> problems) {
        this.problems.addAll(problems);
        this.isStart = true;
    }

    public void updateScore(Long userId, int score) {

        int newScore = scoreBoard.get(userId) + score;
        this.scoreBoard.put(userId, newScore);
    }

    public void nextRound() {
        this.round += 1;
    }

    public List<Rank> calculateRank() {
        // scoreBoard의 userId와 score를 Rank 객체로 변환
        List<Rank> ranks = scoreBoard.entrySet().stream()
            .map(entry -> Rank.builder()
                .userId(entry.getKey())
                .username(players.stream()
                    .filter(player -> player.getUserId().equals(entry.getKey()))
                    .map(Player::getUsername)
                    .findFirst()
                    .orElse("Unknown"))
                .score(entry.getValue())
                .build())
            .sorted((rank1, rank2) -> Integer.compare(rank2.getScore(), rank1.getScore()))
            .collect(Collectors.toList());

        return ranks;
    }
}
