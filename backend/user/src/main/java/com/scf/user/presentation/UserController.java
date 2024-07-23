package com.scf.user.presentation;

import com.scf.user.application.dto.UserInfoResponseDto;
import com.scf.user.application.dto.UserRegisterRequestDto;
import com.scf.user.application.dto.UserRegisterResponseDto;
import com.scf.user.application.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
public class UserController {

    private final UserServiceImpl userService;

    @PostMapping("/join")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequestDto registerRequestDto) {
        log.info("회원가입 요청 requestDto : {} ", registerRequestDto);

        UserRegisterResponseDto registerResponseDto = userService.register(registerRequestDto);
        return ResponseEntity.ok(registerResponseDto);
    }


    // 유저 정보 조회
    @GetMapping("/{userId}")
    public ResponseEntity<UserInfoResponseDto> userinfo(@PathVariable("userId") Long memberId) {
        UserInfoResponseDto userInfo = userService.getUserInfo(memberId);

        return ResponseEntity.ok(userInfo);

    }

    // 회원 탈퇴
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> quitUser(@PathVariable("userId") Long memberId) {
        boolean flag = userService.quitMember(memberId);

        if (flag) {
            return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

    }

}
