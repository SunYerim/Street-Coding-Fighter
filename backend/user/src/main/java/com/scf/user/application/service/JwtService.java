package com.scf.user.application.service;

import com.scf.user.application.dto.TokenDto;
import com.scf.user.global.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtTokenProvider jwtTokenProvider;

    public TokenDto generateToken(Authentication authentication, String id) {
        return jwtTokenProvider.generateToken(authentication, id);
    }

    public Authentication getAuthentication(String token) {
        return jwtTokenProvider.getAuthentication(token);
    }

    public String resolveToken(HttpServletRequest request) {
        return jwtTokenProvider.resolveToken(request);
    }

    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    public Claims parseClaims(String accessToken) {
        return jwtTokenProvider.parseClaims(accessToken);
    }

}
