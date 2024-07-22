package com.scf.user.presentation;

import com.scf.user.application.dto.LoginDto;
import com.scf.user.application.dto.UserLoginResponseDto;
import com.scf.user.application.dto.UserRegisterRequestDto;
import com.scf.user.application.dto.UserRegisterResponseDto;
import com.scf.user.application.service.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import javax.naming.AuthenticationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
@RequiredArgsConstructor
@Slf4j
public class UserController
{


    private final UserServiceImpl userService;

    @PostMapping("/join")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequestDto registerRequestDto) {
        log.info("회원가입 요청 requestDto : {} ", registerRequestDto);

        UserRegisterResponseDto registerResponseDto = userService.register(registerRequestDto);
        return ResponseEntity.ok(registerResponseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@RequestBody LoginDto loginDto, HttpServletRequest request, HttpServletResponse response) {
        try {
            // Authentication 객체를 얻어오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // 인증 정보가 null인 경우, 로그인 필터에서 처리된 인증 정보를 사용할 수 있도록 확인
            if (authentication == null || !authentication.isAuthenticated()) {
                // 여기서 로그인 필터를 통해 인증을 시도할 수 있도록 로직 추가 가능
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            // 로그인 정보 생성
            UserLoginResponseDto responseDto = userService.login(loginDto);
            return ResponseEntity.ok(responseDto);
        } catch (RuntimeException e) {
            log.error("로그인 처리 중 예외 발생: ", e); // 예외 로그 추가
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


    // 유저 정보 조회
//    @GetMapping("/{userId}")
//    public ResponseEntity<?> userinfo(@PathVariable("userId") Long memberId) {
//
//
//    }

}
