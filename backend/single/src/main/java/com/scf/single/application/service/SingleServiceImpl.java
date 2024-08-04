package com.scf.single.application.service;

import com.scf.single.domain.dto.ContentCompletionRequestDto;
import com.scf.single.domain.dto.ContentDetailResponseDto;
import com.scf.single.domain.dto.ContentDetailResponsesDto;
import com.scf.single.domain.dto.ContentListResponseDto;
import com.scf.single.domain.dto.ContentListResponsesDto;
import com.scf.single.domain.entity.Content;
import com.scf.single.domain.entity.ContentCheckUser;
import com.scf.single.domain.entity.Script;
import com.scf.single.domain.repository.ContentCheckUserRepository;
import com.scf.single.domain.repository.ContentRepository;
import com.scf.single.domain.repository.ScriptRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SingleServiceImpl implements SingleService {

    private final ContentCheckUserRepository contentCheckUserRepository;
    private final ScriptRepository scriptRepository;
    private final ContentRepository contentRepository;

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
            .map(script -> new ContentDetailResponseDto(script.getPageNo(),
                script.getScriptContent(), script.getAction(), script.getImageCount()))
            .collect(Collectors.toList());

        return new ContentDetailResponsesDto(contentScripts);
    }

    @Override
    @Transactional
    public void markContentAsCompleted(ContentCompletionRequestDto requestDto) {
        Long memberId = requestDto.getMemberId();
        int contentId = requestDto.getContentId();

        // 콘텐츠가 존재하는지 확인
        Content content = contentRepository.findById(contentId)
            .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없습니다."));

        // 사용자가 이미 수강 완료한 콘텐츠인지 확인
        Optional<ContentCheckUser> existingRecord = contentCheckUserRepository.findByMemberIdAndContent_ContentId(
            memberId, contentId);

        if (existingRecord.isPresent()) {
            // 이미 수강 완료된 콘텐츠인 경우
            throw new IllegalStateException("이미 수강 완료된 콘텐츠입니다.");
        } else {
            // 수강 완료 기록 생성
            ContentCheckUser newRecord = new ContentCheckUser();
            newRecord.setMemberId(memberId);
            newRecord.setComplete(1);  // 수강 완료 상태를 나타내는 값
            newRecord.setContent(content);

            contentCheckUserRepository.save(newRecord);
        }
    }
}
