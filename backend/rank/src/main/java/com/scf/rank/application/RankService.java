package com.scf.rank.application;

import com.scf.rank.domain.model.UserExp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RankService {

    private final RedisTemplate<String, UserExp> redisTemplate;
    private static final String KEY_PREFIX = "user:";

    @KafkaListener(topics = "user-exp", groupId = "ranking-group", containerFactory = "kafkaListenerContainerFactory")
    @Transactional
    public void consumeUserExp(UserExp userExp, Acknowledgment acknowledgment) {

        updateRank(userExp);

        acknowledgment.acknowledge(); // 메시지 처리 완료 후 ACK 전송
    }

    private void updateRank(UserExp userExp) {

        String key = KEY_PREFIX + userExp.getUserId();

        redisTemplate.opsForValue().set(key, userExp);
        System.out.println("Updated ranking for user: " + userExp.getUserId() + " with exp: " + userExp.getExp());
    }

    public UserExp getRank(String userId) {

        String key = KEY_PREFIX + userId;

        ValueOperations<String, UserExp> valueOps = redisTemplate.opsForValue();

        return valueOps.get(key);
    }
}
