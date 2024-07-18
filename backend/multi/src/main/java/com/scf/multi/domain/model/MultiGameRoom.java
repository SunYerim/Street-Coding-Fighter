package com.scf.multi.domain.model;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class MultiGameRoom {

    private final Set<Long> participantsIds = Collections.synchronizedSet(new HashSet<>());
    private String roomId;
    private Long hostId;

    public Set<Long> getParticipantsIds() {
        // 읽기 전용 Set을 반환
        return Collections.unmodifiableSet(this.participantsIds);
    }

    public void add(Long userId) {
        this.participantsIds.add(userId);
    }

    public void remove(Long userId) {
        this.participantsIds.remove(userId);
    }
}
