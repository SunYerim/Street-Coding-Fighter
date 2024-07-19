package com.scf.multi.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Problem {

    private Integer problemInfoId;
    private Integer problemId;
    private Integer type;
    private String category;
    private String title;
    private String content;
    private String answer;
}
