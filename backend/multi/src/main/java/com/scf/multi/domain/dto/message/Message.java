package com.scf.multi.domain.dto.message;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Message {

    private String type;
    private Content content;
}
