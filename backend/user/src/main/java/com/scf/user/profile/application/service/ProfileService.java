package com.scf.user.profile.application.service;

import com.scf.user.profile.domain.dto.HistoryListResponseDto;
import com.scf.user.profile.domain.dto.ProfileResponseDto;

public interface ProfileService {
    // 프로필 정보 조회
    public ProfileResponseDto getProfileInfo(String memberId);
    // 전체 전적 조회
    public HistoryListResponseDto getHistoryList(String memberId);

}
