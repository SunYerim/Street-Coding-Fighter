package com.scf.battle.domain.dto.Problem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemSelectDTO {
    private long problemId;
    private long memberId;

}
