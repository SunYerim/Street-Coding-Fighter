package com.scf.user.profile.domain.dto.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RenewExp {

    private Long memberId;
    private int newExp;

}
