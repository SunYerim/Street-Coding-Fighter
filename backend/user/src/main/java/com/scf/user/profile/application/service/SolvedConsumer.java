package com.scf.user.profile.application.service;

import com.scf.user.profile.domain.dto.SolvedProblemRequestDto;
import com.scf.user.profile.domain.dto.kafka.Solved;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SolvedConsumer {

    // 푼 문제 반영
    private final KafkaMessageProducer kafkaMessageProducer;
    private final ProfileService profileService;

    // 푼 문제를 받아옵니다.
    @KafkaListener(topics = "solved")
    public void updateSolved(Solved solved) {
        System.out.println("Solved Problem: " + solved);
        SolvedProblemRequestDto solvedProblemRequestDto = new SolvedProblemRequestDto();

        solvedProblemRequestDto.setCorrect(solved.getIsCorrect());
        solvedProblemRequestDto.setChoice(solved.getSolveText()); // 주관식
        solvedProblemRequestDto.setChoiceText(solved.getSolve()); // 빈칸, 객관식

        // 사용자가 푼 문제를 db에 저장시킵니다.
        profileService.submitSolved(solved.getMemberId(), solvedProblemRequestDto);
    }

}
