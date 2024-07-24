package com.scf.user.application.service;


import com.scf.user.domain.dto.TokenDto;
import com.scf.user.domain.dto.UserInfoResponseDto;
import com.scf.user.domain.dto.UserRegisterRequestDto;
import com.scf.user.domain.dto.UserRegisterResponseDto;
import com.scf.user.domain.entity.User;
import com.scf.user.domain.repository.UserRepository;
import com.scf.user.infrastructure.security.AuthenticationProviderService;
import com.scf.user.infrastructure.security.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final AuthenticationProviderService authenticationProviderService;
    private final UserRepository userRepository;
    private final RedisService redisService;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public UserServiceImpl(AuthenticationProviderService authenticationProviderService,
        UserRepository userRepository, @Lazy JwtTokenProvider jwtTokenProvider,
        RedisService redisService) {
        this.authenticationProviderService = authenticationProviderService;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisService = redisService;
    }

    @Override
    public UserRegisterResponseDto register(UserRegisterRequestDto registerRequestDto) {
        User saved = userRepository.save(
            User.builder()
                .userId(registerRequestDto.getUserId())
                .password(authenticationProviderService.passwordEncoder()
                    .encode(registerRequestDto.getPassword()))
                .name(registerRequestDto.getName())
                .schoolName(registerRequestDto.getSchoolName())
                .birth(registerRequestDto.getBirth())
                .build());

        return new UserRegisterResponseDto(saved);
    }

    @Override
    public UserInfoResponseDto getUserInfo(Long memberId) {
        User user = userRepository.findById(memberId)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // User 엔티티를 UserInfoResponseDto로 변환
        return new UserInfoResponseDto(
            user.getName(),
            user.getSchoolName(),
            user.getBirth()
        );
    }

    @Override
    @Transactional
    public boolean quitMember(Long memberId) {
        // 사용자 확인
        User user = userRepository.findById(memberId)
            .orElseThrow(() -> new EntityNotFoundException("유저를 찾지 못하였습니다."));

        // 사용자 삭제
        userRepository.delete(user);

        return true;
    }

    @Override
    public boolean checkUserIdDuplicate(String userId) {
        return userRepository.existsByUserId(userId);
    }

    @Override
    public String extractRefreshTokenFromCookie(HttpServletRequest request) {

        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refreshToken = cookie.getValue();
                    log.info("쿠키다 !!!!!" + refreshToken);
                }
            }
        }
        return refreshToken;
    }

    @Override
    // token 재발급
    public TokenDto refreshToken(String refresh) {
        // Redis에서 refresh token 조회
        String memberId = jwtTokenProvider.extractMemberId(refresh);
        log.info("memberId-------- " + memberId);
        String storedRefreshToken = redisService.getValue(memberId);
        log.info("memberIweafsafdd-------- " + storedRefreshToken);

        // 리프레시 토큰이 유효한지 확인
        if (storedRefreshToken == null || !storedRefreshToken.equals(refresh)) {
            log.debug("정보입니다 ----- " + storedRefreshToken);
            throw new RuntimeException("Invalid refresh token. " + storedRefreshToken + "~~~~+");
        }

        // 토큰 유효성 검사
        jwtTokenProvider.validateToken(refresh);

        // 토큰을 새로 생성하고 발급
        String newAccesstoken = jwtTokenProvider.generateAccessToken(Long.valueOf(memberId));
        String newRefreshtoken = jwtTokenProvider.createRefreshToken(Long.valueOf(memberId));

        // redis에 새로운 리프레시 토큰 저장
        Duration expiration = Duration.ofHours(24);
        redisService.setValues(memberId, newRefreshtoken, expiration);

        // 클라이언트에 반환할 TokenDto
        TokenDto newtoken = new TokenDto();
        newtoken.setAccessToken(newAccesstoken);
        newtoken.setRefreshToken(newRefreshtoken);
        // 새로운 액세스 토큰과 refreshToken 생성
        return newtoken;
    }


    // username
    @Override
    public String getName(Long id) {
        return userRepository.findById(id).orElseThrow().getName();
    }


}
