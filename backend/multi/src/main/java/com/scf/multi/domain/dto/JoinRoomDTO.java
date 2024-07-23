package com.scf.multi.domain.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JoinRoomDTO {

    @NotNull(message = "유저 아이디가 필요합니다.")
    private Long userId;

    @NotEmpty(message = "유저 이름이 필요합니다.")
    @Size(min = 3, max = 20, message = "유저 이름은 3~20글자 입니다.")
    private String username;

    @Size(max = 30, message = "방 비밀번호는 30글자를 초과할 수 없습니다.")
    private String roomPassword;
}
