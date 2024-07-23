package com.scf.multi.domain.model;

import com.scf.multi.domain.dto.JoinRoomDTO;
import com.scf.multi.domain.dto.Player;
import com.scf.multi.domain.dto.Problem;
import com.scf.multi.domain.dto.Rank;
import com.scf.multi.global.error.ErrorCode;
import com.scf.multi.global.error.exception.BusinessException;
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

    private String roomId;
    private Long hostId;
    private String title;
    private String password;
    private Integer maxPlayer;

    private final List<Problem> problems = new ArrayList<>();
    private final List<Player> players = Collections.synchronizedList(new ArrayList<>());
    private final Map<Long, Integer> scoreBoard = Collections.synchronizedMap(new HashMap<>());
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

    public void add(JoinRoomDTO joinRoomDTO) {

        String roomPassword = joinRoomDTO.getRoomPassword();
        if (this.password != null && !this.password.equals(roomPassword)) {
            throw new BusinessException(this.password, "roomPassword", ErrorCode.PASSWORD_MISMATCH);
        }

        Long userId = joinRoomDTO.getUserId();
        String username = joinRoomDTO.getUsername();

        this.players.add(new Player(userId, username));
        this.scoreBoard.put(userId, 0);
    }

    public void remove(Long userId) {

        boolean hasPlayer = this.players.stream()
            .anyMatch(player -> player.getUserId().equals(userId));

        if (!hasPlayer || !this.scoreBoard.containsKey(userId)) {
            throw new BusinessException(userId, "userId", ErrorCode.USER_NOT_FOUND);
        }

        this.players.removeIf(player -> player.getUserId().equals(userId));
    }

    public void gameStart(List<Problem> problems) {

        if (this.players.size() < 2) { // 예를 들어, 최소 2명의 플레이어가 있어야 한다고 가정
            throw new BusinessException(players.size(), "참가자 인원", ErrorCode.INSUFFICIENT_PLAYER);
        }

        if (problems == null || problems.isEmpty()) {
            throw new BusinessException(null, "문제", ErrorCode.INVALID_PROBLEM);
        }

        this.problems.addAll(problems);
        this.isStart = true;
    }

    public void updateScore(Long userId, int score) {

        boolean hasPlayer = this.players.stream()
            .anyMatch(player -> player.getUserId().equals(userId));

        if (!hasPlayer || !this.scoreBoard.containsKey(userId)) {
            throw new BusinessException(userId, "userId", ErrorCode.USER_NOT_FOUND);
        }

        int newScore = scoreBoard.get(userId) + score;
        this.scoreBoard.put(userId, newScore);
    }

    public void nextRound() {

        if (!Boolean.TRUE.equals(this.isStart)) {
            throw new BusinessException(isStart, "isStart", ErrorCode.GAME_NOT_START);
        }

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
