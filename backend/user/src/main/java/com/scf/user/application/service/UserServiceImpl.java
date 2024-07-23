package com.scf.user.application.service;


import com.scf.user.domain.dto.UserInfoResponseDto;
import com.scf.user.domain.dto.UserRegisterRequestDto;
import com.scf.user.domain.dto.UserRegisterResponseDto;
import com.scf.user.domain.entity.User;
import com.scf.user.domain.repository.UserRepository;
import com.scf.user.global.AuthenticationProviderService;
import com.scf.user.global.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final AuthenticationProviderService authenticationProviderService;
    private final UserRepository userRepository;

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

//    // refreshToken 재발급
//    @Override
//    public String refreshAccessToken(String accessToken) {
//        // Redis에서 refresh token 조회
//        String memberId = jwtTokenProvider.extractMemberId(accessToken);
//        String storedRefreshToken = redisService.getValue(memberId);
//
//        // 만료 시간 확인
//        long ttl = redisService.ttl(memberId);
//        if (storedRefreshToken == null || ttl <= 0) {
//            log.error("Refresh token is expired or does not exist.");
//        }
//
//        // 새로운 access token 생성
//        return jwtTokenProvider.generateAccessToken(Long.valueOf(memberId));
//    }

    // username
    @Override
    public String getName(Long id) {
        return userRepository.findById(id).orElseThrow().getName();
    }


}
