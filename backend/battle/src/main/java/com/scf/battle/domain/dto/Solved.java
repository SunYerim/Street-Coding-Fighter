package com.scf.battle.domain.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Solved {

    private Long problemId;
    private Long userId;
    private Map<Integer, Integer> solve;
    private Integer submitTime;
    private String roomId;
    private Integer round;
}
