package com.scf.user.member.application.service;

import com.scf.user.member.domain.dto.UserPasswordRequestDto;

public interface ResetService {
    // 사용자 정보 조회
    UserPasswordRequestDto requestUserId(String userId);

    // 비밀번호 재설정 번호 전송
    void sendRestRandomNumber(String userId);

    // 비밀번호 재설정
    void resetPassword(String userId, String newPassword);

    // 인증번호 일치 여부 확인
    boolean validateAuthCode(String userId, String inputCode);

    // 회원가입시 이메일 인증 번호 전송
    void sendRegistrationCode(String email);

    // 회원가입시 인증번호 일치 여부 확인
    boolean isEqualNumber(String email, String code);
}
