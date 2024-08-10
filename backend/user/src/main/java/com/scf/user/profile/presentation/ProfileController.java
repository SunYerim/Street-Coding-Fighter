package com.scf.user.profile.presentation;

import com.scf.user.profile.application.service.ProfileService;
import com.scf.user.profile.domain.dto.DjangoResponseDto;
import com.scf.user.profile.domain.dto.HistoryListResponseDto;
import com.scf.user.profile.domain.dto.ProfileResponseDto;
import com.scf.user.profile.domain.dto.SolvedProblemsListDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

    // 프로필 정보 조회
    @GetMapping
    public ResponseEntity<?> profileInfo(@RequestHeader("memberId") Long memberId) {
        ProfileResponseDto profileInfo = profileService.getProfileInfo(memberId);

        return ResponseEntity.ok(profileInfo);
    }

    // 전체 전적 조회
    @GetMapping("/record")
    public ResponseEntity<?> getHistory(@RequestHeader("memberId") String memberId) {
        HistoryListResponseDto historyList = profileService.getHistoryList(memberId);

        return ResponseEntity.ok(historyList);
    }

    // 푼 문제 조회
    @GetMapping("/solved")
    public ResponseEntity<?> getSolvedHistory(@RequestHeader("memberId") String memberId) {
        SolvedProblemsListDto solvedList = profileService.getSolvedProblemsList(memberId);

        return ResponseEntity.ok(solvedList);
    }

    // 보고서 발급 (django)
    @GetMapping("/reportdetail")
    public ResponseEntity<?> getReportDetail(@RequestHeader("memberId") String memberId) {
        DjangoResponseDto djangoResponse = profileService.getDjangoInfo(memberId);

        return ResponseEntity.ok(djangoResponse);
    }

    // 경험치 반영 (single에서 사용)
    @PostMapping("/public/addExp")
    public ResponseEntity<?> requestAddExp(@RequestParam("memberId") Long memberId) {
        profileService.addSingleExp(memberId);
        return ResponseEntity.ok("경험치 누적이 완료되었습니다.");
    }

    // produce test api
    // 경험치를 내려주고,
//    @PostMapping("/produce")
//    public String produceGameResult(@RequestBody List<RenewExp> renewExp) {
//        kafkaMessageProducer.sendProcessedGameResults(renewExp);
//
//        return "Message sended successfully";
//
//    }


}
