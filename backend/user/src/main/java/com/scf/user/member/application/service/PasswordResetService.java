package com.scf.user.member.application.service;

import com.scf.user.member.domain.dto.UserPasswordRequestDto;

public interface PasswordResetService {
    // 사용자 정보 조회
    UserPasswordRequestDto requestUserId(String userId);

    // 비밀번호 재설정 토큰 전송
    void sendResetUUID(String userId);

    // 비밀번호 재설정
    void resetPassword(String userId, String newPassword);

    // 인증번호 일치 여부 확인
    boolean validateAuthCode(String userId, String inputCode);

}
