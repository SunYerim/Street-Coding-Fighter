package com.scf.user.application.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserLoginRequestDto {

    private String userId;
    private String password;

}
