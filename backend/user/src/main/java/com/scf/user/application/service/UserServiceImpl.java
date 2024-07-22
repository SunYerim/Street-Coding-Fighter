package com.scf.user.application.service;

import com.scf.user.application.dto.UserInfoResponseDto;
import com.scf.user.application.dto.UserLoginResponseDto;
import com.scf.user.application.dto.UserRegisterRequestDto;
import com.scf.user.application.dto.UserRegisterResponseDto;
import com.scf.user.domain.entity.User;
import com.scf.user.domain.repository.UserRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service

public class UserServiceImpl implements UserService{

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;



    // 회원가입
    @Override
    public UserRegisterResponseDto register(UserRegisterRequestDto registerRequestDto) {
        User saved  = userRepository.save(
            User.builder()
                .userId(registerRequestDto.getUserId())
                .password(passwordEncoder.encode(registerRequestDto.getPassword()))
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
    public UserLoginResponseDto login(UserLoginResponseDto loginResponseDto) {

        return null;
    }
}
