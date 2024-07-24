package com.scf.multi.domain.dto.problem;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Problem {

    private Long problemId;
    private Integer type;
    private String category;
    private String title;
    private String content;
    private Map<Integer, Integer> answer;
}
