package com.scf.single.application.service;

import com.scf.single.domain.dto.ContentDetailResponsesDto;
import com.scf.single.domain.dto.ContentListResponsesDto;
import org.springframework.stereotype.Service;

@Service
public interface SingleService {

    // 각 유저의 content 목록 리스트 조회
    ContentListResponsesDto getUserContentList(String memberId);

    // 각 content별 script 조회
    ContentDetailResponsesDto getScripts(int contentId);

}
