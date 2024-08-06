package com.scf.battle.domain.dto.Problem;

import com.scf.battle.domain.enums.GameType;
import com.scf.battle.domain.enums.ProblemType;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemRequestDTO {

    private ProblemType problemType;
    private Long problemId;
    private Long userId;
    private Map<Integer, Integer> solve;
    private String solveText;
    private Integer submitTime;
    private Integer round;
}
