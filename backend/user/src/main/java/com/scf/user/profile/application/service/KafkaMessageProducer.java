package com.scf.user.profile.application.service;

import com.scf.user.profile.domain.dto.kafka.RenewExp;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class KafkaMessageProducer {

    private final KafkaTemplate<String, RenewExp> renewExpKafkaTemplate;

    public void sendProcessedGameResults(RenewExp renewExp) {
        String topic = "user-exp";
        renewExpKafkaTemplate.send(topic, renewExp);
        System.out.println("Sent processed Exp: " + renewExp);
    }

}
