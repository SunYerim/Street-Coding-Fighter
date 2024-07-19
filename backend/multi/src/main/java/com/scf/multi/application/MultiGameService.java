package com.scf.multi.application;

import com.scf.multi.domain.model.MultiGameRoom;
import com.scf.multi.domain.repository.MultiGameRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MultiGameService {

    private final MultiGameRepository multiGameRepository;

    public List<MultiGameRoom> findAllRooms() {
        return multiGameRepository.findAllRooms();
    }

    public MultiGameRoom findOneById(String roomId) {
        return multiGameRepository.findOneById(roomId);
    }

    public String createRoom(Long userId) {
        String roomId = UUID.randomUUID().toString();
        multiGameRepository.addRoom(new MultiGameRoom(roomId, userId));
        return roomId;
    }

    public void deleteRoom(String roomId) {
        multiGameRepository.deleteRoom(roomId);
    }

    public void joinRoom(String roomId, Long userId) {
        multiGameRepository.joinRoom(roomId, userId);
    }

    public void exitRoom(String roomId, Long userId) {
        multiGameRepository.exitRoom(roomId, userId);
    }

    public void markSolution(String userId, String content) {
    }
}
