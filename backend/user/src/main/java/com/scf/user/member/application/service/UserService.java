package com.scf.user.member.application.service;

import com.scf.user.member.domain.dto.TokenDto;
import com.scf.user.member.domain.dto.UserInfoResponseDto;
import com.scf.user.member.domain.dto.UserRegisterRequestDto;
import com.scf.user.member.domain.dto.UserRegisterResponseDto;
import jakarta.servlet.http.HttpServletRequest;

public interface UserService {

    public UserRegisterResponseDto register(UserRegisterRequestDto registerRequestDto);

    public UserInfoResponseDto getUserInfo(String memberId);

    public String getName(Long id);

    public boolean quitMember(String memberId);

    public TokenDto refreshToken(String refreshToken);

    public boolean checkUserIdDuplicate(String userId);

    public String extractRefreshTokenFromCookie(HttpServletRequest request);
}
