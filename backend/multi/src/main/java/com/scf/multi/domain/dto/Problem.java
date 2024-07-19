package com.scf.multi.domain.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Problem {

    private Long problemId;
    private Integer type;
    private String category;
    private String title;
    private String content;
    private Map<Integer, Integer> answer;
}
