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
        if (!this.hostId.equals(userId)) { //방장이 아닐 때
            //예외처리
        }
        if (this.players.size() < 2) { // 2명보다 작을 때
            //예외처리
        }
        if (problems == null || problems.isEmpty()) { // TODO : 문제에 대한 예외처리
            //예외처리
        }
        // 문제를 가져와서 3개씩 나누어 담도록 함
        // TODO : 3개가 아닌 여러개로 바꿀 수 있도록 수정
        int numberOfRounds = (int) Math.ceil((double) problems.size() / 3); // 안 나눠떨어질 때 예외처리
        for (int i = 0; i < numberOfRounds; i++) {
            int startIndex = i * 3;
            int endIndex = Math.min(startIndex + 3, problems.size());
            roundProblems.add(problems.subList(startIndex, endIndex));
        }

        this.isStart = true;
    }

    // 특정 라운드의 문제를 가져오는 메서드
    public List<Problem> getProblemsForRound(Integer roundNumber) {
        if (roundNumber < 1 || roundNumber > roundProblems.size()) {
            // 예외처리 하기
        }
        return roundProblems.get(roundNumber - 1);
    }

    public void updateScore(Long userId, int score) {

        boolean hasPlayer = this.players.stream()
            .anyMatch(player -> player.getUserId().equals(userId));

        if (!hasPlayer || !this.scoreBoard.containsKey(userId)) {
            // TODO : 유저 없는 예외처리
        }

        int newScore = scoreBoard.get(userId) + score;
        this.scoreBoard.put(userId, newScore);
    }

    public void nextRound() {

        if (!Boolean.TRUE.equals(this.isStart)) {
            // TODO : 시작 안 된 상황
        }

        this.round += 1;
    }

}
