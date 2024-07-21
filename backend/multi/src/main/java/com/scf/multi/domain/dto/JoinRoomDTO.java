package com.scf.multi.domain.dto;

import lombok.Data;

@Data
public class JoinRoomDTO {

    private Long userId;
    private String username;
    private String roomPassword;
}
