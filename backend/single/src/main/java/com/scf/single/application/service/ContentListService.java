package com.scf.single.application.service;

import com.scf.single.domain.dto.ContentListResponsesDto;

public interface ContentListService {

    // 각 유저의 목록 리스트 조회
    ContentListResponsesDto getUserContentList(Long memebrId);


}
