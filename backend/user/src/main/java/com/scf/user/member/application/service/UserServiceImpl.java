package com.scf.user.member.application.service;


import com.scf.user.member.application.client.ContentClient;
import com.scf.user.member.domain.dto.UserCharaterTypeResponseDTO;
import com.scf.user.member.domain.dto.UserInfoListResponseDto;
import com.scf.user.member.domain.dto.UserInfotoSingleResponseDto;
import com.scf.user.member.global.exception.NotEnoughExperienceException;
import com.scf.user.profile.domain.repository.CharacterRepository;
import com.scf.user.member.domain.dto.TokenDto;
import com.scf.user.member.domain.dto.UserInfoResponseDto;
import com.scf.user.member.domain.dto.UserRegisterRequestDto;
import com.scf.user.member.domain.dto.UserRegisterResponseDto;
import com.scf.user.member.domain.entity.Member;
import com.scf.user.profile.domain.entity.Character;
import com.scf.user.member.domain.repository.UserRepository;
import com.scf.user.member.infrastructure.security.AuthenticationProviderService;
import com.scf.user.member.infrastructure.security.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final AuthenticationProviderService authenticationProviderService;
    private final UserRepository userRepository;
    private final CharacterRepository characterRepository;
    private final RedisService redisService;
    private final JwtTokenProvider jwtTokenProvider;
    private final ContentClient contentClient;

    @Autowired
    public UserServiceImpl(AuthenticationProviderService authenticationProviderService,
        UserRepository userRepository, CharacterRepository characterRepository,
        @Lazy JwtTokenProvider jwtTokenProvider,
        RedisService redisService, ContentClient contentClient) {
        this.authenticationProviderService = authenticationProviderService;
        this.userRepository = userRepository;
        this.characterRepository = characterRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisService = redisService;
        this.contentClient = contentClient;
    }

    @Override
    @Transactional
    public UserRegisterResponseDto register(UserRegisterRequestDto registerRequestDto) {
        Member member = Member.builder()
            .userId(registerRequestDto.getUserId())
            .password(authenticationProviderService.passwordEncoder()
                .encode(registerRequestDto.getPassword()))
            .name(registerRequestDto.getName())
            .email(registerRequestDto.getEmail())
            .schoolName(registerRequestDto.getSchoolName())
            .birth(registerRequestDto.getBirth())
            .build();

        // Member 엔티티 저장
        Member savedMember = userRepository.save(member);

        // 수강완료 여부 초기화 요청
        contentClient.initializeCompletionStatus(savedMember.getId())
            .block();

        // Character 생성
        Character character = new Character();
        character.setCharacterType(registerRequestDto.getCharacterType());
        character.setCharacterCloth(0); // defalut는 0
        character.setMember(savedMember);

        // Member 엔티티에 Character 설정
        characterRepository.save(character);

        savedMember.setCharacter(character);

        return new UserRegisterResponseDto(savedMember);
    }

    @Override
    public UserInfoResponseDto getUserInfo(String memberId) {
        Member member = userRepository.findById(Long.parseLong(memberId))
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // User 엔티티를 UserInfoResponseDto로 변환
        return new UserInfoResponseDto(
            member.getUserId(),
            member.getName(),
            member.getSchoolName(),
            member.getBirth()
        );
    }

    @Override
    @Transactional
    public boolean quitMember(String memberId) {
        // 사용자 확인
        Member member = userRepository.findById(Long.parseLong(memberId))
            .orElseThrow(() -> new EntityNotFoundException("유저를 찾지 못하였습니다."));

        // 사용자 삭제
        userRepository.delete(member);

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
        log.info("Stored Refresh Token-------- " + storedRefreshToken);

        // 리프레시 토큰이 유효한지 확인
        if (storedRefreshToken == null || !storedRefreshToken.equals(refresh)) {
            log.debug("Invalid refresh token: " + storedRefreshToken);
            throw new RuntimeException("Invalid refresh token.");
        }

        // 토큰 유효성 검사
        jwtTokenProvider.validateToken(refresh);

        // 새로운 액세스 토큰 생성
        String newAccessToken = jwtTokenProvider.generateAccessToken(Long.valueOf(memberId));
        String newRefreshToken = jwtTokenProvider.createRefreshToken(Long.valueOf(memberId));

        // Redis에 새로운 리프레시 토큰 저장
        Duration expiration = Duration.ofHours(24);
        redisService.setValues(memberId, newRefreshToken, expiration);

        // 클라이언트에 반환할 TokenDto
        TokenDto newToken = new TokenDto();
        newToken.setAccessToken(newAccessToken);
        newToken.setRefreshToken(newRefreshToken);

        return newToken; // 새로운 액세스 토큰과 refreshToken 반환
    }


    // username
    @Override
    public String getName(Long id) {
        return userRepository.findById(id).orElseThrow().getName();
    }


    @Override
    public UserInfoListResponseDto sendUserList() {
        // 모든 유저 정보 조회
        List<Member> members = userRepository.findAll();
        System.out.println(members.size());

        List<UserInfotoSingleResponseDto> userInfotoSingleList = members.stream()
            .map(member -> new UserInfotoSingleResponseDto(member.getId(), member.getName()))
            .collect(Collectors.toList());

        return new UserInfoListResponseDto(userInfotoSingleList);
    }

    @Override
    public UserCharaterTypeResponseDTO getUserCharaterType(Long memberId) {
        Member member = userRepository.getById(memberId);
        return new UserCharaterTypeResponseDTO(member.getCharacter().getCharacterType());
    }

    @Transactional
    @Override
    public void updateCharacterCloth(Long memberId, int characterCloth) {
        Member member = userRepository.findById(memberId)
                .orElseThrow(() -> new UsernameNotFoundException("Member not found with id: " + memberId));

        Character character = member.getCharacter();

        if (character == null) {
            throw new IllegalStateException("Character not found for member with id: " + memberId);
        }

        if (character.getExp() < 500) {
            throw new NotEnoughExperienceException("Not enough experience to update character cloth for member with id: " + memberId);
        }

        character.setExp(character.getExp() - 500); // 경험치 갱신
        character.setCharacterCloth(characterCloth);
    }

    @Transactional
    @Override
    public void updateCharacterType(Long memberId, int characterType) {
        Member member = userRepository.findById(memberId)
                .orElseThrow(() -> new UsernameNotFoundException("Member not found with id: " + memberId));

        Character character = member.getCharacter();

        if (character == null) {
            throw new IllegalStateException("Character not found for member with id: " + memberId);
        }

        if (character.getExp() < 500) {
            throw new NotEnoughExperienceException("Not enough experience to update character type for member with id: " + memberId);
        }

        character.setExp(character.getExp() - 500); // 경험치 갱신
        character.setCharacterType(characterType);
    }
}
