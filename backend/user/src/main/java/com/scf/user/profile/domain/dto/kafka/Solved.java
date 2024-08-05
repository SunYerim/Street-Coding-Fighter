package com.scf.user.profile.domain.dto.kafka;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Solved {

    private Long problemId;
    private Long memberId;
    private Map<Integer, Integer> solve;
    private String solveText;
    private Integer submitTime;
    private Boolean isCorrect;

}
