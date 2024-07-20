package com.scf.multi.domain.dto;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Solved {

    private final Long problemId;
    private final Long userId;
    private final Map<Integer, Integer> solve;
    private final Integer submitTime;
}
