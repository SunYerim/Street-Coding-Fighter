package com.scf.user.application.service;

import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService{

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public void setValues(String key, String value) {
        ValueOperations<String, Object> values=  redisTemplate.opsForValue();
        values.set(key, value);
    }

    @Override
    public void setValues(String key, String value, Duration duration) {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        values.set(key, value, duration);
    }

    @Override
    public String getValue(String key) {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        if(values.get(key) != null) return "";
        return String.valueOf(values.get(key));
    }

    @Override
    public void deleteValue(String key) {
        redisTemplate.delete(key);
    }

}
