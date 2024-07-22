package com.scf.user.global;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scf.user.application.dto.LoginDto;
import com.scf.user.application.dto.TokenDto;
import com.scf.user.application.service.JwtService;
import com.scf.user.application.service.RedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper; // Jackson ObjectMapper를 사용하여 JSON 파싱
    private final RedisService redisService;


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            // 요청 본문에서 JSON 데이터를 읽어옵니다.
            LoginDto loginRequest = objectMapper.readValue(request.getInputStream(), LoginDto.class);

            String userId = loginRequest.getUserId(); // JSON에서 userId 추출
            String password = loginRequest.getPassword(); // JSON에서 password 추출

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, password);
            return authenticationManager.authenticate(authenticationToken);

        } catch (IOException e) {
            throw new BadCredentialsException("Invalid login request format", e);
        }
    }


    // 로그인을 성공했을 시 실행하는 메서드
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        // 성공적으로 인증된 경우 토큰을 생성하고 설정합니다.
        UserDetails userDetails = (UserDetails) authResult.getPrincipal();
        TokenDto tokenDto = jwtTokenProvider.generateToken(authResult, userDetails.getUsername());

        response.addHeader("Authorization", "Bearer " + tokenDto.getAccessToken());
        redisService.setValues(userDetails.getUsername(), tokenDto.getRefreshToken());
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Authentication Failed");
    }

}
