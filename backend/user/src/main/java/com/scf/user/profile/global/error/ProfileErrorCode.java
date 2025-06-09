package com.scf.user.profile.global.error;

import com.scf.user.global.error.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ProfileErrorCode implements ErrorCode {

    PROFILE_USER_NOT_FOUND("프로필에 해당 유저가 없습니다.", HttpStatus.NOT_FOUND),
    CHARACTER_NOT_FOUND("캐릭터 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    PROBLEM_NOT_FOUND("문제 정보를 가져올 수 없습니다.", HttpStatus.NOT_FOUND);

    private final String message;
    private final HttpStatus httpStatus;

    ProfileErrorCode(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
