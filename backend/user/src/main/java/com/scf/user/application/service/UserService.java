package com.scf.user.application.service;

import com.scf.user.domain.dto.UserInfoResponseDto;
import com.scf.user.domain.dto.UserRegisterRequestDto;
import com.scf.user.domain.dto.UserRegisterResponseDto;

public interface UserService {
    public UserRegisterResponseDto register(UserRegisterRequestDto registerRequestDto);
    public UserInfoResponseDto getUserInfo(Long memberId);
    public String getName(Long id);
    public boolean quitMember(Long memberId);
//    public String refreshAccessToken(String refreshToken);
}
