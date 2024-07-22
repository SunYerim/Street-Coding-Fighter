package com.scf.user.application.service;

import com.scf.user.application.dto.UserInfoResponseDto;
import com.scf.user.application.dto.UserLoginResponseDto;
import com.scf.user.application.dto.UserRegisterRequestDto;
import com.scf.user.application.dto.UserRegisterResponseDto;

public interface UserService {
    public UserRegisterResponseDto register(UserRegisterRequestDto registerRequestDto);
    public UserInfoResponseDto getUserInfo(String userId);
    public UserLoginResponseDto login(UserLoginResponseDto loginResponseDto);

}
