package com.scf.user.member.application.service;

import com.scf.user.member.domain.dto.TokenDto;
import com.scf.user.member.domain.dto.UserCharaterTypeResponseDTO;
import com.scf.user.member.domain.dto.UserInfoListResponseDto;
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

    // 유저 전체 리스트 조회
    public UserInfoListResponseDto sendUserList();

    public UserCharaterTypeResponseDTO getUserCharaterType(Long memberId);

    @Transactional
    void updateCharacterCloth(Long memberId, int characterCloth);

    @Transactional
    void updateCharacterType(Long memberId, int characterType);
}
