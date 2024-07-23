package com.scf.user.application.dto;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserInfoResponseDto {

    private String name;
    private String schoolName;
    private Date birth;

}
