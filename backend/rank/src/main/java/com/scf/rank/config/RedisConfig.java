package com.scf.rank.config;

import com.scf.rank.domain.dto.UserExp;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericToStringSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, UserExp> redisTemplate(RedisConnectionFactory redisConnectionFactory) {

        RedisTemplate<String, UserExp> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        template.setValueSerializer(new GenericToStringSerializer<>(UserExp.class));
        return template;
    }
}

