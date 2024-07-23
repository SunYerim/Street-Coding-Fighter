package com.scf.user.global;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiry}")
    private long accessTokenExpiry;

    @Value("${jwt.refresh-token-expiry}")
    private long refreshTokenExpiry;

    private static final String AUTHORITY_KEY = "auth";

    private Key getSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // accessToken 생성
    public String generateAccessToken(Authentication authentication, Long id) {
        String authority = authentication.getAuthorities().toString();
        long now = new Date().getTime();

        String accessToken = Jwts.builder().setSubject(authentication.getName())
            .claim(AUTHORITY_KEY, authority).claim("id", id).setIssuedAt(new Date(now))
            .setExpiration(new Date(now + accessTokenExpiry))
            .signWith(getSecretKey(), SignatureAlgorithm.HS256).compact();

        return accessToken;
    }

    // refreshToken 생성
    public String createRefreshToken() {
        long now = new Date().getTime();

        String refreshToken = Jwts.builder().setIssuedAt(new Date(now))
            .setExpiration(new Date(now + refreshTokenExpiry))
            .signWith(getSecretKey(), SignatureAlgorithm.HS256).compact();

        return refreshToken;
    }

    // JWT 토큰에서 사용자 정보를 추출하여 Authentication 객체를 생성
    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(
            claims.get(AUTHORITY_KEY).toString());
        UserDetails principal = new User(claims.getSubject(), "", List.of(authority));

        return new UsernamePasswordAuthenticationToken(principal, "", List.of(authority));

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
            Jwts.parserBuilder().setSigningKey(getSecretKey()).build().parseClaimsJws(token);

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
            return Jwts.parser().setSigningKey(getSecretKey()).parseClaimsJws(accessToken)
                .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

}

