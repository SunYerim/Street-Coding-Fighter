package com.scf.user.member.infrastructure.security;


import com.scf.user.member.application.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenProvider {

    @Value("${spring.jwt.secret}")
    private String secret;

    @Value("${spring.jwt.access-token-expiry}")
    private long accessTokenExpiry;

    @Value("${spring.jwt.refresh-token-expiry}")
    private long refreshTokenExpiry;

    private static final String AUTHORITY_KEY = "auth";
    private final UserService userService;

    private Key getSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // accessToken 생성
    public String generateAccessToken(Long id) {
//        String authority = authentication.getAuthorities().toString();
        String authority = "USER";
        String name = userService.getName(id);
        long now = new Date().getTime();

        String accessToken = Jwts.builder()
            .setSubject(id.toString())
            .claim(AUTHORITY_KEY, authority)
            .claim("memberId", id)
            .claim("username", name)
            .setIssuedAt(new Date(now))
            .setExpiration(new Date(now + accessTokenExpiry))
            .signWith(getSecretKey(), SignatureAlgorithm.HS256)
            .compact();

        return accessToken;
    }


    // refreshToken 생성
    public String createRefreshToken(Long id) {
//        String authority = authentication.getAuthorities().toString();
        long now = new Date().getTime();

        String refreshToken = Jwts.builder()
            .setSubject(id.toString())
            .claim(AUTHORITY_KEY, "USER")
            .claim("memberId", id)
            .setIssuedAt(new Date(now))
            .setExpiration(new Date(now + refreshTokenExpiry))
            .signWith(getSecretKey(), SignatureAlgorithm.HS256)
            .compact();

        return refreshToken;
    }


    // JWT 토큰에서 사용자 정보를 추출하여 Authentication 객체를 생성
    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);

        if (claims == null) {
            throw new IllegalArgumentException("Claims cannot be null");
        }

        String subject = claims.getSubject();
        if (subject == null || subject.isEmpty()) {
            throw new IllegalArgumentException("Subject cannot be null or empty");
        }

        // 권한 설정
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(
            claims.get(AUTHORITY_KEY).toString()));

        return new UsernamePasswordAuthenticationToken(subject, token, authorities);
    }


    // HTTP 요청에서 JWT 토큰을 추출
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // JWT 토큰의 유효성을 검증
    public boolean validateToken(String token) {

        try {
            Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty.", e);
        }
        return false;
    }

    // JWT 토큰에서 Claims 객체를 추출
    public Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(accessToken)
                .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // JWT에서 memberId 추출
    public String extractMemberId(String token) {
        Claims claims = parseClaims(token);
        if (claims == null || claims.getSubject() == null) {
            throw new IllegalArgumentException("Invalid token or subject is missing");
        }
        return claims.getSubject();
    }


}

