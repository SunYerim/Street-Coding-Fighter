package com.scf.user.member.presentation;

import com.scf.user.member.application.service.GachaService;
import com.scf.user.member.application.service.PasswordResetService;
import com.scf.user.member.application.service.RedisService;
import com.scf.user.member.application.service.UserService;
import com.scf.user.member.domain.dto.LogoutDto;
import com.scf.user.member.domain.dto.PasswordResetRequestDto;
import com.scf.user.member.domain.dto.TokenDto;
import com.scf.user.member.domain.dto.UserInfoListResponseDto;
import com.scf.user.member.domain.dto.UserInfoResponseDto;
import com.scf.user.member.domain.dto.UserPasswordRequestDto;
import com.scf.user.member.domain.dto.UserRegisterRequestDto;
import com.scf.user.member.domain.dto.UserRegisterResponseDto;
import com.scf.user.member.domain.dto.VerifyCodeRequestDto;
import com.scf.user.member.infrastructure.security.JwtCookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    private final GachaService gachaService;
    private final JwtCookieUtil jwtCookieUtil;
    private final PasswordResetService passwordResetService;

    // 회원가입
    @PostMapping("/public/join")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequestDto registerRequestDto) {
        log.info("회원가입 요청 requestDto : {} ", registerRequestDto);

        UserRegisterResponseDto registerResponseDto = userService.register(registerRequestDto);
        return ResponseEntity.ok(registerResponseDto);
    }


    // 유저 정보 조회
    @GetMapping("/info")
    public ResponseEntity<UserInfoResponseDto> userinfo(
        @RequestHeader("memberId") String memberId) {
        UserInfoResponseDto userInfo = userService.getUserInfo(memberId);

        return ResponseEntity.ok(userInfo);

    }

    // 회원 탈퇴
    @DeleteMapping("/quit")
    public ResponseEntity<?> quitUser(@RequestHeader("memberId") String memberId) {
        boolean flag = userService.quitMember(memberId);

        if (flag) {
            redisService.deleteValue(String.valueOf(memberId)); // Redis에서 삭제
            return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

    }

    // 로그아웃
    @PostMapping("/public/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutDto logoutDto) {
        redisService.deleteValue(String.valueOf(logoutDto.getMemberId())); // Redis에서 삭제
        return ResponseEntity.ok("로그아웃이 성공적으로 되었습니다.");
    }

    // 아이디 중복 확인
    @GetMapping("/public/validate/{userId}")
    public ResponseEntity<?> checkUserId(@PathVariable("userId") String userId) {
        if (userService.checkUserIdDuplicate(userId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용하고 있는 아이디입니다."); // 409
        } else {
            return ResponseEntity.ok("사용가능한 아이디입니다."); // 200
        }
    }

    // token 재발급
    @PostMapping("/public/reissue")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request,
        HttpServletResponse response) {
        // 쿠키에서 리프레시 토큰 추출
        String refresh = userService.extractRefreshTokenFromCookie(request);
        if (refresh == null) {
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        // 새로운 토큰 받아오기.
        TokenDto newAccessToken = userService.refreshToken(refresh);

        response.setHeader("Authorization", "Bearer " + newAccessToken.getAccessToken());
        response.addCookie(jwtCookieUtil.createCookie("refresh", newAccessToken.getRefreshToken()));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 비밀번호 변경
    @PostMapping("/public/change-password")
    public ResponseEntity<?> changePassword(
        @RequestBody PasswordResetRequestDto passwordResetRequestDto) {
        passwordResetService.resetPassword(passwordResetRequestDto.getUserId(),
            passwordResetRequestDto.getNewPassword());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 인증번호 전송
    @PostMapping("/public/request-verification-code")
    public ResponseEntity<?> sendVerificationCode(
        @RequestBody UserPasswordRequestDto passwordRequestDto) {
        try {
            String userId = passwordRequestDto.getUserId();
            passwordResetService.sendResetUUID(userId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 인증번호 일치 확인
    @PostMapping("/public/request-verification")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequestDto verifyrequest) {
        boolean isValid = passwordResetService.validateAuthCode(verifyrequest.getUserId(),
            verifyrequest.getCode());

        if (isValid) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 유저 전체 리스트 조회
    @GetMapping("/public/list")
    public ResponseEntity<?> getList() {
        UserInfoListResponseDto userInfoListResponseDto = userService.sendUserList();
        return ResponseEntity.ok(userInfoListResponseDto);
    }

    @GetMapping("/public/charaterType")
    public ResponseEntity<?> getCharaterType(@RequestHeader("memberId") Long memberId){
        String memberIdString = String.valueOf(memberId);
        Object userInfo = userService.getUserInfo(memberIdString);
        if (userInfo != null) {
            return new ResponseEntity<>(userService.getUserCharaterType(memberId),HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/gacha/character-cloth")
    public ResponseEntity<?> gachaCloth(@RequestHeader("memberId") Long memberId) {
        try {
            // 랜덤으로 옷 타입을 뽑음
            int characterCloth = gachaService.drawClothingType();

            // 뽑힌 옷 타입을 해당 사용자의 캐릭터에 업데이트
            userService.updateCharacterCloth(memberId, characterCloth);

            // 성공 응답 반환
            return ResponseEntity.ok("Character cloth updated successfully.");

        } catch (UsernameNotFoundException e) {
            // 회원을 찾을 수 없는 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found: " + e.getMessage());
        } catch (IllegalStateException e) {
            // 캐릭터가 없는 경우 등
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid operation: " + e.getMessage());
        } catch (Exception e) {
            // 기타 예외 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/gacha/character-type")
    public ResponseEntity<?> gachaCharacterType(@RequestHeader("memberId") Long memberId) {
        try {
            // 랜덤으로 캐릭터 타입을 뽑음
            int characterType = gachaService.drawCharacterType();

            // 뽑힌 캐릭터 타입을 해당 사용자의 캐릭터에 업데이트
            userService.updateCharacterType(memberId, characterType);

            // 성공 응답 반환
            return ResponseEntity.ok("Character Type updated successfully.");

        } catch (UsernameNotFoundException e) {
            // 회원을 찾을 수 없는 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Member not found: " + e.getMessage());
        } catch (IllegalStateException e) {
            // 캐릭터가 없는 경우 등
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid operation: " + e.getMessage());
        } catch (Exception e) {
            // 기타 예외 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An unexpected error occurred: " + e.getMessage());
        }
    }
}
