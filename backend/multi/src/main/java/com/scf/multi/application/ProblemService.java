package com.scf.multi.application;

import com.scf.multi.domain.dto.problem.Problem;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ProblemService {

    private final WebClient webClient;

    public ProblemService(WebClient.Builder webClientBuilder,
        @Value("${problem.server.url}") String problemServerUrl) {
        this.webClient = webClientBuilder.baseUrl(problemServerUrl).build();
    }

    public List<Problem> getProblems() {

        // 예시 문제 반환 코드
        List<Problem> problems = new ArrayList<>();
        problems.add(new Problem(1L, 0, "정렬", "버블 정렬", "버블 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(2L, 0, "정렬", "삽입 정렬", "삽입 정렬 내용", Map.of(0, 1, 1, 2)));
        return problems;

//        return webClient.get()
//            .uri("/api/problems") // 나중에 협의 후 수정
//            .retrieve()
//            .bodyToFlux(Problem.class)
//            .collectList()
//            .block();
    }
}
