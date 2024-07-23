package com.scf.user.application.service;

import com.scf.user.application.dto.LoginDto;
import com.scf.user.application.dto.UserInfoResponseDto;
import com.scf.user.application.dto.UserLoginResponseDto;
import com.scf.user.application.dto.UserRegisterRequestDto;
import com.scf.user.application.dto.UserRegisterResponseDto;
import org.springframework.security.core.Authentication;

public interface UserService {
    public UserRegisterResponseDto register(UserRegisterRequestDto registerRequestDto);
    public UserInfoResponseDto getUserInfo(String userId);
    public UserLoginResponseDto login(LoginDto loginDto);
    public String getName(String userId);
}
