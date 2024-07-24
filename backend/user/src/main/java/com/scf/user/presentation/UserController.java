package com.scf.user.presentation;

import com.scf.user.application.service.RedisService;
import com.scf.user.application.service.UserService;
import com.scf.user.domain.dto.TokenDto;
import com.scf.user.domain.dto.UserInfoResponseDto;
import com.scf.user.domain.dto.UserRegisterRequestDto;
import com.scf.user.domain.dto.UserRegisterResponseDto;
import com.scf.user.global.JwtTokenProvider;
import com.scf.user.global.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    private final UserService userService;
    private final RedisService redisService;
    private final JwtUtil jwtUtil;

    // 회원가입
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

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("memberId") Long memberId) {
        redisService.deleteValue(String.valueOf(memberId)); // Redis에서 삭제
        return ResponseEntity.ok("로그아웃이 성공적으로 되었습니다.");
    }

    // 아이디 중복 확인
    @GetMapping("/validate/{userId}")
    public ResponseEntity<?> checkUserId(@PathVariable("userId") String userId) {
        if (userService.checkUserIdDuplicate(userId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용하고 있는 아이디입니다."); // 409
        } else {
            return ResponseEntity.ok("사용가능한 아이디입니다."); // 200
        }
    }

    // token 재발급
    @PostMapping("/reissue")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        // 쿠키에서 리프레시 토큰 추출
        String refresh = userService.extractRefreshTokenFromCookie(request);
        if (refresh == null) {
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        // 새로운 토큰 받아오기.
        TokenDto newAccessToken = userService.refreshToken(refresh);

        response.setHeader("Authorization", "Bearer " + newAccessToken.getAccessToken());
        response.addCookie(jwtUtil.createCookie("refresh", newAccessToken.getRefreshToken()));
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
