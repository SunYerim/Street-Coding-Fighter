package com.scf.user.global.error;

import org.springframework.http.HttpStatus;

public interface ErrorCode {

    String getMessage();

    HttpStatus getHttpStatus();

}
