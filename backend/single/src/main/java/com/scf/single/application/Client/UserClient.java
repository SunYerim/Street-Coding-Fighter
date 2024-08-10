package com.scf.single.application.Client;

import com.scf.single.domain.dto.UserInfoListResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class UserClient {

    private final WebClient webClient;

    public UserClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://www.ssafy11s.com/user").build();
    }

    public Mono<UserInfoListResponseDto> getUserList() {
        return webClient.get()
            .uri("/public/list")
            .retrieve()
            .bodyToMono(UserInfoListResponseDto.class)
            .doOnError(e -> System.err.println("Error: " + e.getMessage())); // 오류 로그 출력
    }

}
