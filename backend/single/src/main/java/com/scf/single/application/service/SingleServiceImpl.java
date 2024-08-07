package com.scf.single.application.service;

import com.scf.single.application.Client.UserClient;
import com.scf.single.domain.dto.ContentCompletionRequestDto;
import com.scf.single.domain.dto.ContentCreateRequestDto;
import com.scf.single.domain.dto.ContentDetailResponseDto;
import com.scf.single.domain.dto.ContentDetailResponsesDto;
import com.scf.single.domain.dto.ContentListResponseDto;
import com.scf.single.domain.dto.ContentListResponsesDto;
import com.scf.single.domain.dto.MemberDto;
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
    private final UserClient userClient;

    // content 목록 조회
    @Override
    public ContentListResponsesDto getUserContentList(Long memberId) {
        // memberId를 사용하여 content_check_user 테이블 조회
        List<ContentCheckUser> contentCheckUsers = contentCheckUserRepository.findByMemberId(
            memberId);

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
            ContentCheckUser record = existingRecord.get();
            if (record.getComplete() == 1) {
                throw new IllegalStateException("이미 수강 완료된 콘텐츠입니다.");
            } else {
                // 수강 미완료 상태인 경우 완료로 업데이트.
                record.setComplete(1);
                contentCheckUserRepository.save(record);
            }
        }
        // 회원가입 이후로 새로 생긴 컨텐츠인 경우
        else {
            // 수강 완료 기록 생성
            ContentCheckUser newRecord = new ContentCheckUser();
            newRecord.setMemberId(memberId);
            newRecord.setComplete(1);  // 수강 완료 상태를 나타내는 값
            newRecord.setContent(content);

            contentCheckUserRepository.save(newRecord);
        }
    }

    // 회원가입시 존재하는 컨텐츠에 대해 수강기록 0으로 초기화.
    @Override
    @Transactional
    public void initializeCompletionStatus(Long memberId) {
        List<Content> contents = contentRepository.findAll();
        for (Content content : contents) {
            ContentCheckUser contentCheckUser = new ContentCheckUser();
            contentCheckUser.setMemberId(memberId);
            contentCheckUser.setContent(content);
            contentCheckUser.setComplete(0);
            contentCheckUserRepository.save(contentCheckUser);
        }
    }

    // 개별 컨텐츠를 생성
    @Override
    public void createContent(ContentCreateRequestDto contentCreateRequestDto) {
        // 사용자가 입력한 컨텐츠를 생성합니다.
        Content content = new Content();
        content.setContentExp(contentCreateRequestDto.getContentExp());
        content.setTitle(contentCreateRequestDto.getTitle());
        content.setContentType(contentCreateRequestDto.getContentType());
        Content savedContent = contentRepository.save(content);

        // 회원 목록 조회 및 수강 상태 초기화
        userClient.getUserList().subscribe(userInfoListResponseDto -> {
            System.out.println(userInfoListResponseDto.getMembers());
            List<MemberDto> members = userInfoListResponseDto.getMembers();

            for (MemberDto member : members) {
                ContentCheckUser contentCheckUser = new ContentCheckUser();
                contentCheckUser.setMemberId(member.getMemberId());
                contentCheckUser.setContent(savedContent);
                contentCheckUser.setComplete(0);  // 초기 상태: 미수강
                contentCheckUserRepository.save(contentCheckUser);
            }
        });
    }
}