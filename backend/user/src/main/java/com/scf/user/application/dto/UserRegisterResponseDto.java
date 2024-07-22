package com.scf.user.application.dto;

import com.scf.user.domain.entity.User;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterResponseDto {
    private String userId;
    private String name;

    public UserRegisterResponseDto(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
    }
}
