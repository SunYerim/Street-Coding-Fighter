package com.scf.user.application.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TokenDto {

    private String accessToken;
    private String refreshToken;
//    private String name;

    public TokenDto(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
//        this.name = name;
    }
}
