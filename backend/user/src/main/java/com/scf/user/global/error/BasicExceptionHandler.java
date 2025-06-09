package com.scf.user.global.error;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class BasicExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<String> handleBusinessException(BusinessException e) {
        return ResponseEntity.status(e.getHttpStatus())
            .body(e.getMessage() + " " + e.getFieldName() + " : " + e.getInvalidValue());
    }

}
