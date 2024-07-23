package com.scf.user.presentation;

import com.scf.user.application.service.RedisService;
import com.scf.user.domain.dto.UserInfoResponseDto;
import com.scf.user.domain.dto.UserRegisterRequestDto;
import com.scf.user.domain.dto.UserRegisterResponseDto;
import com.scf.user.application.service.UserServiceImpl;
import com.scf.user.global.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserServiceImpl userService;
    private final RedisService redisService;
    private final JwtUtil jwtUtil;

    @PostMapping("/join")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequestDto registerRequestDto) {
        log.info("회원가입 요청 requestDto : {} ", registerRequestDto);

        UserRegisterResponseDto registerResponseDto = userService.register(registerRequestDto);
        return ResponseEntity.ok(registerResponseDto);
    }


    // 유저 정보 조회
    @GetMapping
    public ResponseEntity<UserInfoResponseDto> userinfo(@RequestHeader("memberId") Long memberId) {
        UserInfoResponseDto userInfo = userService.getUserInfo(memberId);

        return ResponseEntity.ok(userInfo);

    }

    // 회원 탈퇴
    @DeleteMapping
    public ResponseEntity<?> quitUser(@RequestHeader("memberId") Long memberId) {
        boolean flag = userService.quitMember(memberId);

        if (flag) {
            redisService.deleteValue(String.valueOf(memberId)); // Redis에서 삭제
            return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

    }

    // logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("memberId") Long memberId) {
        redisService.deleteValue(String.valueOf(memberId)); // Redis에서 삭제
        return ResponseEntity.ok("로그아웃이 성공적으로 되었습니다.");
    }


}
