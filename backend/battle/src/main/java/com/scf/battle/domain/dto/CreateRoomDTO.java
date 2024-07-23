package com.scf.battle.domain.dto;


import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CreateRoomDTO {

    private String title;
    private String password;
}
