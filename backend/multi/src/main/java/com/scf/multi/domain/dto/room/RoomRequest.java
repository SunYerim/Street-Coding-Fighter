package com.scf.multi.domain.dto.room;

import lombok.Builder;
import lombok.Data;

public class RoomRequest {

    @Data
    @Builder
    public static class ListDTO {

        private String roomId;

        private String title;

        private String hostname;

        private Integer maxPlayer;

        private Integer curPlayer;

        private Boolean isLock;
    }
}
