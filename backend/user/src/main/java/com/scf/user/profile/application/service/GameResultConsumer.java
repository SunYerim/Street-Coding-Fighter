package com.scf.user.profile.application.service;

import com.scf.user.profile.domain.dto.kafka.GameResult;
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
    @KafkaListener(topics = "game-result-battle")
    public void processGameResults(GameResult gameResult) {
        // 유저의 경험치를 업데이트
        System.out.println("Processing game results: " + gameResult.getGameRank());

        // battle 게임이면
        if (gameResult.getGameType().equals(0)) {
            // 경험치를 업데이트 합니다.
            List<RenewExp> updatedExp = updateExperiencePoints(gameResult.getGameRank(), 0);

            // 처리된 데이터 다시 전송
            kafkaMessageProducer.sendProcessedGameResults(updatedExp);
        }

    }

    // multi 모드
    @KafkaListener(topics = "game-result-multi")
    public void processMultiGameResults(GameResult gameResult) {
        System.out.println("Processing multi game results: " + gameResult.getGameRank());

        // multi 게임이면
        if (gameResult.getGameType().equals(1)) {
            // 경험치를 업데이트
            List<RenewExp> updatedExp = updateExperiencePoints(gameResult.getGameRank(), 1);

            // 처리된 데이터를 다시 전송
            kafkaMessageProducer.sendProcessedGameResults(updatedExp);

        }
    }

    // exp를 업데이트.
    private List<RenewExp> updateExperiencePoints(List<Rank> ranks, int type) {
        // ranks 리스트를 순회하면서 각 사용자 경험치를 업데이트.
        List<RenewExp> updatedExpList = new ArrayList<>();

        for (Rank rank : ranks) {
            Long memberId = rank.getMemberId();
            int currentExp = profileService.getProfileInfo(memberId).getExp();
            int newExp = currentExp;
            if (type == 0) {
                newExp += calculateMultiExp(rank.getScore(), rank.getRank());
            } else if (type == 1) {
                newExp += calculateBattleExp(rank.getScore(), rank.getRank());
            }

            // 경험치를 업데이트
            profileService.updateExp(memberId, newExp);

            // 갱신된 경험치 정보를 DTO에 담기
            RenewExp renewExp = new RenewExp(memberId, newExp);
            updatedExpList.add(renewExp);
        }

        return updatedExpList;
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
    private int calculateBattleExp(int score, int rank) {
        // 기본 경험치
        int baseExp = score * 10; // 기본 경험치를 높게 설정

        // 순위 보너스: 1등에게는 50%, 2등에게는 10% 보너스
        int rankBonusPercentage;
        if (rank == 1) {
            rankBonusPercentage = 50;
        } else if (rank == 2) {
            rankBonusPercentage = 10;
        } else {
            rankBonusPercentage = 0; // `battle` 모드에서는 2명만 플레이 -> 다른 순위는 없음.
        }

        // 순위 보너스 계산
        int rankBonus = (baseExp * rankBonusPercentage) / 100;

        int expGain = baseExp + rankBonus;

        return Math.max(expGain, 0);
    }


}
