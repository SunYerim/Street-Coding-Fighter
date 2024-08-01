package com.scf.battle.application;

import com.scf.battle.domain.dto.Problem;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProblemService {

    public List<Problem> getProblem() {
        List<Problem> problems = new ArrayList<>();
        problems.add(new Problem(1L, 0, "정렬", "버블 정렬", "버블 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(2L, 0, "정렬", "삽입 정렬", "삽입 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(1L, 0, "정렬", "버블 정렬", "버블 정렬 내용", Map.of(0, 1, 1, 2)));
        return problems;

    }
}
