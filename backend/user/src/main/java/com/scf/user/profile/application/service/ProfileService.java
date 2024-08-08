package com.scf.user.profile.application.service;

import com.scf.user.profile.domain.dto.DjangoResponseDto;
import com.scf.user.profile.domain.dto.HistoryListResponseDto;
import com.scf.user.profile.domain.dto.ProfileResponseDto;
import com.scf.user.profile.domain.dto.kafka.SolvedProblemKafkaRequestDto;
import com.scf.user.profile.domain.dto.SolvedProblemsListDto;

public interface ProfileService {

    // 프로필 정보 조회
    public ProfileResponseDto getProfileInfo(Long memberId);

    // 전체 전적 조회
    public HistoryListResponseDto getHistoryList(String memberId);

    // 푼 문제 리스트 조회
    public SolvedProblemsListDto getSolvedProblemsList(String memberId);

    // django에 보고서 생성 시 필요한 data 조회
    public DjangoResponseDto getDjangoInfo(String memberId);

    // 경험치를 update
    void updateExp(Long memberId, int newExp);

    // 푼 문제를 등록
    void submitSolved(Long memberId, SolvedProblemKafkaRequestDto problemRequestDto);
}
