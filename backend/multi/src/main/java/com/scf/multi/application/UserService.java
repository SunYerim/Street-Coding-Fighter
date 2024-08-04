package com.scf.multi.application;

import com.scf.multi.domain.dto.user.Solved;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class UserService {

    private final WebClient webClient;

    public UserService(WebClient.Builder webClientBuilder,
        @Value("${user.server.url}") String userServerUrl) {
        this.webClient = webClientBuilder.baseUrl(userServerUrl).build();
    }

    public void saveUserSolveds(Map<Long, List<Solved>> solveds) {

        webClient.post()
            .uri("/solved")
            .bodyValue(solveds)
            .retrieve() // 요청 실행
            .bodyToMono(Void.class);
    }
}
