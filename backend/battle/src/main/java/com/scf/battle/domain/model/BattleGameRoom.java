package com.scf.battle.domain.model;

import com.scf.battle.domain.dto.User.FightDTO;
import com.scf.battle.domain.dto.User.Player;
import com.scf.battle.domain.dto.Problem.Problem;
import com.scf.battle.global.error.ErrorCode;
import com.scf.battle.global.error.exception.BusinessException;
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
    private Player playerA;
    private Player playerB;
    //private final Map<Long, Integer> scoreBoard = Collections.synchronizedMap(new HashMap<>()); // player, score
    private Boolean isAttack;
    private Boolean isStart;
    private Integer finalRound;
    private Integer currentRound;
    private Boolean hasPlayerASubmitted;
    private Boolean hasPlayerBSubmitted;


    public void add(Long userId, String username, String roomPassword) {
        if (roomPassword.equals(this.password)) {
            this.playerB = new Player(userId, username, 100);
        } else {
            // 예외처리
        }
    }

    public void startGame(List<Problem> problems, Long memberId) {
        if (!this.hostId.equals(memberId)) { //방장이 아닐 때
            throw new BusinessException(memberId, "memberId", ErrorCode.USER_NOT_HOST);
        }
        if (playerA.getUserId() == null || playerB.getUserId() == null) { // 2명보다 작을 때
            throw new BusinessException(roomId, "roomId", ErrorCode.INSUFFICIENT_PLAYER);
        }
        if (problems == null || problems.isEmpty()) { // TODO : 문제에 대한 예외처리
            throw new BusinessException(roomId, "roomId", ErrorCode.GAME_ALREADY_STARTED);
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
        if (roundNumber < 0 || roundNumber > roundProblems.size()) {
            // 예외처리 하기
        }
        return roundProblems.get(roundNumber);
    }

    public FightDTO updateHp(Long userId, int power) {
        if (playerA == null || playerB == null) {
            throw new IllegalArgumentException("Player not found");
        }
        if (playerA.getUserId().equals(userId)) {
            hasPlayerASubmitted = true;
            updatePlayerHp(playerB, power);
        } else if (playerB.getUserId().equals(userId)) {
            hasPlayerBSubmitted = true;
            updatePlayerHp(playerA, power);
        } else {
            throw new IllegalArgumentException("Invalid userId");
        }
        return FightDTO.builder()
            .userId(userId)
            .isAttack(this.isAttack)
            .power(power)
            .build();
    }

    private void updatePlayerHp(Player player, int power) {
        int adjustedPower = this.isAttack ? -power : power;
        if(isAttack){
            if(playerA.getUserId().equals(player.getUserId())) player = playerB; // 내가 B
            else player = playerA; // 내가 A
        }
        if (!isAttack) {
            this.isAttack = true;
        }
        player.setHp(player.getHp() - adjustedPower);
    }

    public Integer nextRound() {

        if (!Boolean.TRUE.equals(this.isStart)) {
            // TODO : 시작 안 된 상황
        }
        if(this.finalRound == currentRound){ // 끝난상황
            return -1;
        }
        hasPlayerASubmitted = false;
        hasPlayerBSubmitted = false;
        this.isAttack = false;
        this.currentRound += 1;
        return currentRound;
    }

}
