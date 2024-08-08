package com.scf.user.profile.application.service;

import com.scf.user.profile.domain.dto.kafka.SolvedProblemKafkaRequestDto;
import com.scf.user.profile.domain.dto.kafka.Solved;
import java.util.List;
import java.util.Map;
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
    public void updateSolved(List<Map<String, Object>> solvedMaps) {
        // Deserialize the list of maps to a list of Solved objects
        List<Solved> solveds = solvedMaps.stream()
            .map(Solved::fromMap)
            .toList();

        System.out.println("Solved Problems: " + solveds);

        // Iterate over the list of Solved objects
        for (Solved solved : solveds) {
            SolvedProblemKafkaRequestDto solvedProblemKafkaRequestDto = new SolvedProblemKafkaRequestDto();

            // Set properties based on the solved object
            solvedProblemKafkaRequestDto.setProblemId(solved.getProblemId());
            solvedProblemKafkaRequestDto.setCorrect(solved.getIsCorrect());
            solvedProblemKafkaRequestDto.setChoice(solved.getSolveText()); // 주관식
            solvedProblemKafkaRequestDto.setChoiceText(solved.getSolve()); // 빈칸, 객관식

            System.out.println(solved.getIsCorrect());
            System.out.println(solved.getSolveText());
            System.out.println(solved.getSolve());

            // Use the profileService to submit solved problems to the database
            profileService.submitSolved(solved.getUserId(), solvedProblemKafkaRequestDto);
        }
    }

}
