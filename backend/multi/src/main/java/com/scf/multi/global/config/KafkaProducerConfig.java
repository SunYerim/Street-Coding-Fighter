package com.scf.multi.global.config;

import com.scf.multi.domain.dto.user.GameResult;
import com.scf.multi.domain.dto.user.Rank;
import com.scf.multi.domain.dto.user.Solved;
import java.util.List;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, List<Solved>> solvedDTOProducerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs(Solved.class));
    }

    @Bean
    public KafkaTemplate<String, List<Solved>> solvedDTOKafkaTemplate() {
        return new KafkaTemplate<>(solvedDTOProducerFactory());
    }

    @Bean
    public ProducerFactory<String, GameResult> resultDTOProducerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs(Rank.class));
    }

    @Bean
    public KafkaTemplate<String, GameResult> resultDTOKafkaTemplate() {
        return new KafkaTemplate<>(resultDTOProducerFactory());
    }

    @Bean
    public Map<String, Object> producerConfigs(Class<?> valueClass) {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        props.put(ProducerConfig.RETRIES_CONFIG, 3);
        props.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
        props.put(ProducerConfig.LINGER_MS_CONFIG, 1);
        props.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, "gzip");
        return props;
    }
}
