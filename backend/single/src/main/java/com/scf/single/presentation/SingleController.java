package com.scf.single.presentation;

import com.scf.single.application.service.SingleService;
import com.scf.single.domain.dto.ContentListResponsesDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("edu")
@Slf4j
@RequiredArgsConstructor
public class SingleController {

    private final SingleService singleService;

    // 목록 조회
    @GetMapping
    public ResponseEntity<?> getList(@RequestHeader("memberId") String memberId) {
        // 서비스 단에서 조회
        ContentListResponsesDto listResponsesDto = singleService.getUserContentList(memberId);

        return ResponseEntity.ok(listResponsesDto);

    }


}