package com.scf.user.member.global.error;

import com.scf.user.global.error.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum MemberErrorCode implements ErrorCode {

    // USER
    USER_NOT_FOUND("해당 사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    DUPLICATED_USER_ID("이미 존재하는 사용자 ID입니다.", HttpStatus.CONFLICT),
    INVALID_MEMBER_ID("잘못된 사용자 ID입니다.", HttpStatus.BAD_REQUEST),
    INVALID_AUTH_CODE("인증 코드가 일치하지 않거나 만료되었습니다.", HttpStatus.BAD_REQUEST),

    // TOKEN
    INVALID_REFRESH_TOKEN("리프레시 토큰이 유효하지 않습니다", HttpStatus.UNAUTHORIZED),
    TOKEN_VALIDATION_FALID("토큰 검증에 실패했습니다.", HttpStatus.UNAUTHORIZED),

    // CHARACTER
    NOT_ENOUGH_EXPERIENCE("캐릭터를 변경할 경험치가 부족합니다.", HttpStatus.BAD_REQUEST),
    CHARACTER_NOT_FOUND("사용자의 캐릭터 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),

    // COOKIE
    REFRESH_TOKEN_NOT_FOUND_IN_COOKIE("쿠키에서 리프레시 토큰을 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);

    private final String message;
    private final HttpStatus httpStatus;

    MemberErrorCode(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }


}
