package com.scf.rank.application;

import com.scf.rank.domain.model.UserExp;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
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
    }

    public UserExp getRank(Long userId) {

        String key = KEY_PREFIX + userId;

        ValueOperations<String, UserExp> valueOps = redisTemplate.opsForValue();

        return valueOps.get(key);
    }

    public List<UserExp> findAll() {

        Set<String> keys = redisTemplate.keys("*");

        List<UserExp> ranks = new ArrayList<>();

        if(keys != null) {
            for(String key : keys) {
                UserExp userExp = redisTemplate.opsForValue().get(key);
                ranks.add(userExp);
            }
        }

        return ranks;
    }
}
