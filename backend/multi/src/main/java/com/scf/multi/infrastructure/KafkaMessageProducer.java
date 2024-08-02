package com.scf.multi.infrastructure;

import com.scf.multi.domain.dto.user.GameRank;
import com.scf.multi.domain.dto.user.Solved;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaMessageProducer {

    private final KafkaTemplate<String, Solved> solvedKafkaTemplate;

    private final KafkaTemplate<String, GameRank> resultKafkaTemplate;

    public void sendSolved(Solved solved) {
        String topic = "solved";
        solvedKafkaTemplate.send(topic, solved);
        System.out.println("Sent SolvedDTO: " + solved);
    }

    public void sendResult(GameRank rank) {
        String topic = "game-result";
        resultKafkaTemplate.send(topic, rank);
        System.out.println("Sent ResultDTO: " + rank);
    }
}

