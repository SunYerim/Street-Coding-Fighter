package com.scf.single.application.service;

import com.scf.single.domain.dto.ContentDetailResponseDto;
import com.scf.single.domain.dto.ContentDetailResponsesDto;
import com.scf.single.domain.dto.ContentListResponseDto;
import com.scf.single.domain.dto.ContentListResponsesDto;
import com.scf.single.domain.entity.ContentCheckUser;
import com.scf.single.domain.entity.Script;
import com.scf.single.domain.repository.ContentCheckUserRepository;
import com.scf.single.domain.repository.ScriptRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SingleServiceImpl implements SingleService {

    private final ContentCheckUserRepository contentCheckUserRepository;
    private final ScriptRepository scriptRepository;

    // content 목록 조회
    @Override
    public ContentListResponsesDto getUserContentList(String memberId) {
        // memberId를 사용하여 content_check_user 테이블 조회
        List<ContentCheckUser> contentCheckUsers = contentCheckUserRepository.findByMemberId(
            Long.parseLong(memberId));

        // DTO로 변환
        List<ContentListResponseDto> contentList = contentCheckUsers.stream()
            .map(cu -> new ContentListResponseDto(cu.getContent().getContentId(), cu.getComplete()))
            .collect(Collectors.toList());
        return new ContentListResponsesDto((contentList));
    }

    @Override
    public ContentDetailResponsesDto getScripts(int contentId) {
        // contentId를 사용하여 script 테이블 조회
        List<Script> scripts = scriptRepository.findByContent_ContentId(contentId);

        // DTO로 변환
        List<ContentDetailResponseDto> contentScripts = scripts.stream()
            .map(script -> new ContentDetailResponseDto(script.getPageNo(), script.getScriptContent(), script.getAction(), script.getImageCount()))
            .collect(Collectors.toList());

        return new ContentDetailResponsesDto(contentScripts);
    }
}
