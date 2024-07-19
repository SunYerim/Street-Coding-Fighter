package com.scf.user.application.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserRegisterRequestDto
{
    private String id;
    private String password;
    private String name;
    private String schoolName;
    private Date birth;
}
