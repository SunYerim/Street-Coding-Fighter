package com.scf.multi.domain.repository;

import com.scf.multi.domain.dto.Solved;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Repository;

@Repository
public class SolvedRepository {

    Map<Long, List<Solved>> solveds = Collections.synchronizedMap(new HashMap<Long, List<Solved>>());

    public void save(Long userId, Solved solved) {

        List<Solved> solvedList = solveds.get(userId);
        if (solvedList == null || solvedList.isEmpty()) { // 첫 문제 저장
            solvedList = new ArrayList<>();
            solvedList.add(solved);
            solveds.put(userId, solvedList);
            return;
        }
        solvedList.add(solved);
        solveds.put(userId, solvedList);
    }
}
