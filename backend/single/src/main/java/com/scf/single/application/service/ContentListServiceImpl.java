package com.scf.single.application.service;

import com.scf.single.domain.dto.ContentListResponseDto;
import com.scf.single.domain.dto.ContentListResponsesDto;
import com.scf.single.domain.entity.ContentCheckUser;
import com.scf.single.domain.repository.ContentRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ContentListServiceImpl implements ContentListService{

    private final ContentRepository contentRepository;

    // content 목록 조회
    @Override
    public ContentListResponsesDto getUserContentList(Long memberId) {
        // memberId를 사용하여 content_check_user 테이블 조회
        List<ContentCheckUser> contentCheckUsers = contentRepository.findByMemberId(memberId);


        // DTO로 변환
        List<ContentListResponseDto> contentList = contentCheckUsers.stream()
            .map(cu -> new ContentListResponseDto(cu.getContent().getContentId(), cu.getComplete()))
            .collect(Collectors.toList());
        return new ContentListResponsesDto((contentList));
    }
}
