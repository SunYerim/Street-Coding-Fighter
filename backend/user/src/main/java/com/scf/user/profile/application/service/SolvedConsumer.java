package com.scf.user.profile.application.service;

import com.scf.user.profile.domain.dto.kafka.SolvedProblemKafkaRequestDto;
import com.scf.user.profile.domain.dto.kafka.Solved;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SolvedConsumer {

    // 푼 문제 반영
    private final ProfileService profileService;

    // 푼 문제를 받아옵니다.
    @KafkaListener(topics = "solved", containerFactory = "solvedKafkaListenerContainerFactory")
    public void updateSolved(List<Solved> solvedList) {
        // solvedList를 순회하면서 solved객체에 사용자가 푼 문제를 db에 저장합니다.
        for (Solved solved : solvedList) {
            SolvedProblemKafkaRequestDto solvedProblemKafkaRequestDto = new SolvedProblemKafkaRequestDto();

            solvedProblemKafkaRequestDto.setCorrect(solved.getIsCorrect());
            solvedProblemKafkaRequestDto.setChoice(solved.getSolveText()); // 주관식
            solvedProblemKafkaRequestDto.setChoiceText(solved.getSolve()); // 빈칸, 객관식

            // 사용자가 푼 문제를 db에 저장시킵니다.
            profileService.submitSolved(solved.getUserId(), solvedProblemKafkaRequestDto);
        }

    }

}
