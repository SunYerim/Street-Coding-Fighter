package com.scf.user.profile.application.service;

import com.scf.user.profile.domain.dto.kafka.RenewExp;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class KafkaMessageProducer {

    private final KafkaTemplate<String, List<RenewExp>> renewExpKafkaTemplate;

    public void sendProcessedGameResults(List<RenewExp> renewExpList) {
        String topic = "renew-exp";
        renewExpKafkaTemplate.send(topic, renewExpList);
        System.out.println("Sent processed Exp: " + renewExpList);
    }

}
