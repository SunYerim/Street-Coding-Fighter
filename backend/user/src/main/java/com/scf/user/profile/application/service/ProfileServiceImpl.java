package com.scf.user.profile.application.service;

import com.scf.user.member.domain.entity.Member;
import com.scf.user.member.domain.repository.UserRepository;
import com.scf.user.profile.domain.dto.HistoryListResponseDto;
import com.scf.user.profile.domain.dto.HistoryResponseDto;
import com.scf.user.profile.domain.dto.ProfileResponseDto;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;

    // 프로필 정보 조회
    @Override
    public ProfileResponseDto getProfileInfo(String memberId) {
        // 멤버 정보 조회
        Member member = userRepository.findById(Long.parseLong(memberId))
            .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 프로필 DTO 생성
        return ProfileResponseDto.builder()
            .name(member.getName())
            .birth(member.getBirth())
            .exp(member.getCharacter().getExp())
            .character(member.getCharacter().getCharacterType())
            .school(member.getSchoolName())
            .build();
    }

    @Override
    public HistoryListResponseDto getHistoryList(String memberId) {
        // 멤버 정보 조회
        Member member = userRepository.findById(Long.parseLong(memberId))
            .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 회원이 가지고 있는 게임 결과기록들 중 상위 10개만 listDTO에 담아서 return시킨다.
        List<HistoryResponseDto> historyList = member.getRecords().stream()
            .sorted((r1, r2) -> Integer.compare(r2.getScore(), r1.getScore())) // 우선 점수로 정렬
            .limit(10) // 상위 10개
            .map(record -> HistoryResponseDto.builder()
                .time(record.getTime().toString())
                .rank(record.getRanking())
                .score(record.getScore())
                .gametype(record.getGameType())
                .build())
            .toList();
        return new HistoryListResponseDto(historyList);
    }
}
