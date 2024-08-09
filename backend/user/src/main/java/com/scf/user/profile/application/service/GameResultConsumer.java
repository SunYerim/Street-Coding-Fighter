package com.scf.user.profile.application.service;

import com.scf.user.profile.domain.dto.kafka.BattleGameResult;
import com.scf.user.profile.domain.dto.kafka.MultiGameResult;
import com.scf.user.profile.domain.dto.kafka.Rank;
import com.scf.user.profile.domain.dto.kafka.RenewExp;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameResultConsumer {

    private final KafkaMessageProducer kafkaMessageProducer;
    private final ProfileService profileService;

    // battle 모드
    @KafkaListener(topics = "game-result-battle", groupId = "game-results-group")
    public void processGameResults(BattleGameResult battleGameResult) {
        // 각 유저의 경험치를 업데이트
        Long playerA = battleGameResult.getPlayerAId();
        Long playerB = battleGameResult.getPlayerBId();
        int win = battleGameResult.getResult(); // 누가 이겼는가
        int gameType = battleGameResult.getGameType(); // 기본 경험치 게임타입 반영 (임시)

        // playerA의 기존 경험치
        int expA = profileService.getProfileInfo(playerA).getExp();
        int expB = profileService.getProfileInfo(playerB).getExp();

        // username
        String playerAName = profileService.getProfileInfo(playerA).getName();
        String playerBName = profileService.getProfileInfo(playerB).getName();

        List<Integer> players = calculateBattleExp(win);

        // 경험치를 업데이트.
        int newExpA = expA + players.get(0);
        int newExpB = expB + players.get(1);

        updateExpoint(playerA, newExpA);
        updateExpoint(playerB, newExpB);

        // 처리된 데이터를 다시 전송
        // List형식이 아닌 RenewExp 객체로 보내도록 수정합니다.
        RenewExp arenew = new RenewExp(playerA, playerAName, newExpA);
        RenewExp brenew = new RenewExp(playerB, playerBName, newExpB);

        kafkaMessageProducer.sendProcessedGameResults(arenew);
        kafkaMessageProducer.sendProcessedGameResults(brenew);

    }

    // multi 모드
    @KafkaListener(topics = "game-result-multi", groupId = "game-results-group", containerFactory = "kafkaListenerContainerFactory")
    public void processMultiGameResults(MultiGameResult multiGameResult) {
        System.out.println("Processing multi game results: " + multiGameResult.getGameRank());

        // multi 게임이면
        if (multiGameResult.getGameType().equals(0)) {
            // 경험치를 업데이트
            List<RenewExp> updatedExp = updateExperiencePoints(multiGameResult.getGameRank());

            // 처리된 데이터를 다시 전송
            // 게임 참여한 유저 수 만큼 for문을 돌면서 RenewExp자체를 전송합니다.
            for (RenewExp exp : updatedExp) {
                kafkaMessageProducer.sendProcessedGameResults(exp);
            }
        }
    }

    // exp를 업데이트.
    private List<RenewExp> updateExperiencePoints(List<Rank> ranks) {
        // ranks 리스트를 순회하면서 각 사용자 경험치를 업데이트.
        List<RenewExp> updatedExpList = new ArrayList<>();

        for (Rank rank : ranks) {
            Long memberId = rank.getUserId();
            String name = rank.getUsername();

            // 기존 경험치
            int currentExp = profileService.getProfileInfo(memberId).getExp();

            // 반영할 경험치
            int newExp = currentExp + calculateMultiExp(rank.getScore(), rank.getRank());

            // 경험치를 업데이트
            profileService.updateExp(memberId, newExp);

            // 갱신된 경험치 정보를 DTO에 담기
            RenewExp renewExp = new RenewExp(memberId, name, newExp);
            updatedExpList.add(renewExp);
        }

        return updatedExpList;
    }

    // 사용자의 경험치를 누적하여 db에 저장
    private void updateExpoint(Long memberId, int addExp) {
        // 사용자를 조회합니다.
        int currentExp = profileService.getProfileInfo(memberId).getExp();
        int newExp = currentExp + addExp;

        profileService.updateExp(memberId, newExp);
    }

    // multi 모드 경험치 계산
    private int calculateMultiExp(int score, int rank) {
        // 기본 경험치
        int baseExp = score;

        // 순위 보너스: 1등에게는 30%, 2등에게는 20%, 3등에게는 10% 보너스
        // 4등부터는 보너스 없음
        int rankBonusPercentage;
        if (rank == 1) {
            rankBonusPercentage = 30;
        } else if (rank == 2) {
            rankBonusPercentage = 20;
        } else if (rank == 3) {
            rankBonusPercentage = 10;
        } else {
            rankBonusPercentage = 0;
        }

        // 순위 보너스 계산
        int rankBonus = (baseExp * rankBonusPercentage) / 100;

        int expGain = baseExp + rankBonus;

        return Math.max(expGain, 0);
    }

    // battle 모드 경험치 계산
    private List<Integer> calculateBattleExp(int win) {
        List<Integer> returnExp = new ArrayList<>();

        // 기본 경험치
        int baseExp = 100; // 기본경험치 (임시)

        // 순위 보너스: 1등에게는 50%, 2등에게는 10% 보너스
        int aRankBonusPercentage;
        int bRankBonusPercentage;

        // a win
        if (win == 1) {
            aRankBonusPercentage = 50;
            bRankBonusPercentage = 10;

        }
        // b win
        else if (win == 2) {
            aRankBonusPercentage = 10;
            bRankBonusPercentage = 50;
        }
        // 무승부 (rank == 0)
        else {
            aRankBonusPercentage = 5;
            bRankBonusPercentage = 5;
        }

        // 순위 보너스 계산
        int aRankBonus = (baseExp * aRankBonusPercentage) / 100;
        int bRankBonus = (baseExp * bRankBonusPercentage) / 100;

        int aExpGain = baseExp + aRankBonus;
        int bExpGain = baseExp + bRankBonus;

        returnExp.add(aExpGain);
        returnExp.add(bExpGain);
        return returnExp;
    }
}
