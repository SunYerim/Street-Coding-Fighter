package com.scf.user.profile.global.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import org.springframework.kafka.support.serializer.JsonDeserializer;

public class ListJsonDeserializer<T> extends JsonDeserializer<List<T>> {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Class<T> clazz;

    public ListJsonDeserializer(Class<T> clazz) {
        super();
        this.clazz = clazz;
    }

    @Override
    public List<T> deserialize(String topic, byte[] data) {
        try {
            return objectMapper.readValue(data,
                objectMapper.getTypeFactory().constructCollectionType(List.class, clazz));
        } catch (IOException e) {
            throw new RuntimeException("Failed to deserialize JSON", e);
        }
    }
}
