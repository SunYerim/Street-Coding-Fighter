package com.scf.user.domain.dto;

import java.time.LocalDate;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserRegisterRequestDto
{
    private String userId;
    private String password;
    private String name;
    private String schoolName;
    private LocalDate birth;

}
