package com.scf.rank.presentation;

import com.scf.rank.application.RankService;
import com.scf.rank.domain.model.UserExp;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rank")
public class RankController {

    private final RankService rankingService;

    @GetMapping("/{userId}")
    public UserExp getRank(@PathVariable String userId) {

        UserExp userExp = rankingService.getRank(userId);

        if (userExp == null) {
            throw new ResourceNotFoundException("유저에 해당되는 랭킹이 없습니다: " + userId);
        }

        return userExp;
    }
}