package com.scf.user.global;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import com.scf.user.application.dto.TokenDto;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenProvider {
    private static final String SECRET = "7d1b1d6d36d8e6a8f1bda6a7f473f87b012b0345a1b5f";
    private static final String AUTHORITY_KEY = "auth";
    private static final Long ACCESS_TOKEN_EXPIRY = 60*60*1000L; // 60분
    private static final Long REFRESH_TOKEN_EXPIRY = 14*24*60*1000L; // 14일

    public static String getSecret() {
        return SECRET;
    }

    // 토큰 생성
    public TokenDto generateToken(Authentication authentication, String name) {
        String authority = authentication.getAuthorities().toString();
        long now = new Date().getTime();

        String accessToken = Jwts.builder()
            .setSubject(authentication.getName())
            .claim(AUTHORITY_KEY, authority)
            .claim("name", name)
            .setExpiration(new Date(now + ACCESS_TOKEN_EXPIRY))
            .signWith(SignatureAlgorithm.HS256, SECRET)
            .compact();

        String refreshToken = Jwts.builder()
            .setExpiration(new Date(now + REFRESH_TOKEN_EXPIRY))
            .signWith(SignatureAlgorithm.HS256, SECRET)
            .compact();

        return new TokenDto(accessToken, refreshToken);
    }

    // JWT 토큰에서 사용자 정보를 추출하여 Authentication 객체를 생성
    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(claims.get(AUTHORITY_KEY).toString());
        UserDetails principal = new User(claims.getSubject(), "", List.of(authority));

        return new UsernamePasswordAuthenticationToken(principal, "", List.of(authority));

    }

    // HTTP 요청에서 JWT 토큰을 추출
    public String resolveToken(HttpServletRequest request) {
        return request.getHeader("Authorization");
    }

    // JWT 토큰의 유효성을 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(SECRET)
                .build()
                .parseClaimsJws(token);

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
            return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(accessToken)
                .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

}

