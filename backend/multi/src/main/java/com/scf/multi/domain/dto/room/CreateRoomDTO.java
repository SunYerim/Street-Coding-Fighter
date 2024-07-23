package com.scf.multi.domain.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateRoomDTO {

    @NotBlank(message = "제목을 입력해야 합니다.")
    @Size(max = 20, message = "제목은 최대 20자까지 가능합니다.")
    private String title;

    @Size(max = 20, message = "비밀번호는 최대 20자까지 가능합니다.")
    private String password;

    @NotBlank(message = "최대 인원수를 입력해주세요.")
    private Integer maxPlayer;
}
