package com.scf.user.profile.application.service;

import com.scf.user.member.application.service.UserService;
import com.scf.user.profile.domain.dto.kafka.Rank;
import com.scf.user.profile.domain.dto.kafka.RenewExp;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameResultConsumer {

    private final KafkaTemplate<String, List<Rank>> kafkaTemplate;
    private final KafkaMessageProducer kafkaMessageProducer;
    private final ProfileService profileService;

    @KafkaListener(topics = "game_result", groupId = "game-result-group")
    public void processGameResults(List<Rank> ranks) {
        // 유저의 경험치를 업데이트
        System.out.println("Processing game results: " + ranks);

        // 경험치를 업데이트 합니다.
        List<RenewExp> updatedExp = updateExperiencePoints(ranks);

        // 처리된 데이터 다시 전송
        kafkaMessageProducer.sendProcessedGameResults(updatedExp);

    }

    private List<RenewExp> updateExperiencePoints(List<Rank> ranks) {
        // 경험치를 업데이트 해줍니다.
        // ranks 리스트를 순회하면서 각 사용자 경험치를 업데이트.
        List<RenewExp> updatedExpList = new ArrayList<>();

        for (Rank rank : ranks) {
            Long memberId = rank.getMemberId();
            int currentExp = profileService.getProfileInfo(memberId).getExp();
            int newExp = currentExp + calculateExp(rank.getScore(), rank.getRank());

            // 경험치를 업데이트
            profileService.updateExp(memberId, newExp);

            // 갱신된 경험치 정보를 DTO에 담기
            RenewExp renewExp = new RenewExp(memberId, newExp);
            updatedExpList.add(renewExp);
        }

        return updatedExpList;
    }

    private int calculateExp(int score, int rank) {
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

}
