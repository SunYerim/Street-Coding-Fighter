package com.scf.user.application.service;

import com.scf.user.application.dto.LoginDto;
import com.scf.user.application.dto.TokenDto;
import com.scf.user.application.dto.UserInfoResponseDto;
import com.scf.user.application.dto.UserLoginResponseDto;
import com.scf.user.application.dto.UserRegisterRequestDto;
import com.scf.user.application.dto.UserRegisterResponseDto;
import com.scf.user.domain.entity.User;
import com.scf.user.domain.repository.UserRepository;
import com.scf.user.global.AuthenticationProviderService;
import com.scf.user.global.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final AuthenticationProviderService authenticationProviderService;
    private final UserRepository userRepository;
    private final RedisService redisService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final MemberDetailService memberDetailService;

    @Override
    public UserRegisterResponseDto register(UserRegisterRequestDto registerRequestDto) {
        User saved = userRepository.save(
            User.builder()
                .userId(registerRequestDto.getUserId())
                .password(authenticationProviderService.passwordEncoder().encode(registerRequestDto.getPassword()))
                .name(registerRequestDto.getName())
                .schoolName(registerRequestDto.getSchoolName())
                .birth(registerRequestDto.getBirth())
                .build());

        return new UserRegisterResponseDto(saved);
    }

    @Override
    public UserInfoResponseDto getUserInfo(String userId) {
        return null;
    }

    @Override
    public UserLoginResponseDto login(LoginDto loginDto) {
        UsernamePasswordAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(loginDto.getUserId(), loginDto.getPassword());

        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        if (authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            log.debug("userDetails정보입니다..." + userDetails.getUsername());
            TokenDto tokenDto = jwtTokenProvider.generateToken(authentication, userDetails.getUsername());

            log.debug("tokenDto 정보입니다. " + tokenDto.getAccessToken());
            redisService.setValues(userDetails.getUsername(), tokenDto.getRefreshToken());

            String userName = getName(loginDto.getUserId());
            User user = (User) memberDetailService.loadUserByUsername(userDetails.getUsername());

            return new UserLoginResponseDto(tokenDto.getAccessToken(), tokenDto.getRefreshToken(), user.getId(), userName);
        } else {
            throw new IllegalArgumentException("Authentication principal is not an instance of UserDetails");
        }
    }

    @Override
    public String getName(String userId) {
        return userRepository.findByUserId(userId).orElseThrow().getUserId();
    }
}
