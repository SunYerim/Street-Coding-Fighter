package com.scf.user.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

// HTTP 요청에서 JWT 토큰을 추출하고 이를 기반으로 사용자의 인증을 처리하는 필터
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
        FilterChain filterChain)
        throws ServletException, IOException {

        // 요청 URL 가져오기
        String requestURI = request.getRequestURI();

        // 토큰이 필요 없는 요청인지 확인
        if (requestURI.startsWith("/user/login") || requestURI.startsWith("/user/join")
            || requestURI.startsWith("/user/validate/")) {
            filterChain.doFilter(request, response); // 다음 필터로 진행
            return;
        }

        String token = jwtTokenProvider.resolveToken(request);
        boolean isValidateToken = jwtTokenProvider.validateToken(token);

        if (token != null && isValidateToken) {
            Authentication authentication = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            throw new ServletException("유효성 검사 통과가 안 됐습니다.");
        }

        filterChain.doFilter(request, response);
    }


}
