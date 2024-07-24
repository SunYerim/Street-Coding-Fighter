package com.scf.user.application.service;

import com.scf.user.domain.dto.TokenDto;
import com.scf.user.domain.dto.UserInfoResponseDto;
import com.scf.user.domain.dto.UserRegisterRequestDto;
import com.scf.user.domain.dto.UserRegisterResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;

public interface UserService {

    public UserRegisterResponseDto register(UserRegisterRequestDto registerRequestDto);

    public UserInfoResponseDto getUserInfo(Long memberId);

    public String getName(Long id);

    public boolean quitMember(Long memberId);

    public TokenDto refreshToken(String refreshToken);

    public boolean checkUserIdDuplicate(String userId);

    public String extractRefreshTokenFromCookie(HttpServletRequest request);
}
