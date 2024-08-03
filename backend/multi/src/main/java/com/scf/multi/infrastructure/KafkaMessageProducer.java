package com.scf.multi.infrastructure;

import com.scf.multi.domain.dto.user.Rank;
import com.scf.multi.domain.dto.user.Solved;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaMessageProducer {

    private final KafkaTemplate<String, List<Solved>> solvedKafkaTemplate;

    private final KafkaTemplate<String, List<Rank>> resultKafkaTemplate;

    public void sendSolved(List<Solved> solved) {
        String topic = "solved";
        solvedKafkaTemplate.send(topic, solved);
        System.out.println("Sent SolvedDTO: " + solved);
    }

    public void sendResult(List<Rank> rank) {
        String topic = "game-result";
        resultKafkaTemplate.send(topic, rank);
        System.out.println("Sent ResultDTO: " + rank);
    }
}

