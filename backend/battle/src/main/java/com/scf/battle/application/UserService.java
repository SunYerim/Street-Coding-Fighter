package com.scf.battle.application;

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

    public Integer getCharacterType(Long memberId) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/{memberId}")
                        .build(memberId))
                .retrieve()
                .bodyToMono(Integer.class)
                .block();
    }

}
