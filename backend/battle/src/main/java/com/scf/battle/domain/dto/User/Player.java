package com.scf.battle.domain.dto.User;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Player {

    private Long userId;
    private String username;
    private Integer Hp;
}
