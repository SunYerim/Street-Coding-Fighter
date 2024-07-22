package com.scf.multi.global.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    GAME_NOT_START("게임이 아직 시작되지 않았습니다.", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_PLAYER("충분한 플레이어가 없어, 게임을 시작할 수 없습니다.", HttpStatus.BAD_REQUEST),
    INVALID_PROBLEM("추가된 문제가 유효하지 않습니다.", HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH("방 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND("방에서 해당 유저를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);

    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
