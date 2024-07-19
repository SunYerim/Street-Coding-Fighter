package com.scf.multi.domain.model;

import com.scf.multi.domain.dto.Problem;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class MultiGameRoom {

    private final Set<Long> participantsIds = Collections.synchronizedSet(new HashSet<>());
    private final List<Problem> problems = new ArrayList<>();
    private String roomId;
    private Long hostId;
    private Boolean isStart;

    public Set<Long> getParticipantsIds() {
        // 읽기 전용 Set을 반환
        return Collections.unmodifiableSet(this.participantsIds);
    }

    public List<Problem> getProblems() {
        // 읽기 전용 List 반환
        return Collections.unmodifiableList(this.problems);
    }

    public void add(Long userId) {
        this.participantsIds.add(userId);
    }

    public void remove(Long userId) {
        this.participantsIds.remove(userId);
    }

    public void gameStart(List<Problem> problems) {
        this.problems.addAll(problems);
        this.isStart = true;
    }
}
