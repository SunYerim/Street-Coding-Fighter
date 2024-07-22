package com.scf.multi.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JoinRoomDTO {

    private Long userId;
    private String username;
    private String roomPassword;
}
