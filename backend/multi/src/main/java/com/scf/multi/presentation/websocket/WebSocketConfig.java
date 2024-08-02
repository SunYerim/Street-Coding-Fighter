package com.scf.multi.presentation.websocket;

import com.scf.multi.application.MultiGameService;
import com.scf.multi.application.UserService;
import com.scf.multi.infrastructure.KafkaMessageProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final MultiGameService multiGameService;
    private final KafkaMessageProducer kafkaMessageProducer;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new MultiGameWebSocketHandler(multiGameService, kafkaMessageProducer), "/multi")
            .addInterceptors(new HttpHandshakeInterceptor())
            .setAllowedOrigins("*"); // Cross-Origin 설정
    }
}
