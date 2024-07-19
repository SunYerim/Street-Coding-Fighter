package com.scf.multi.application;

import com.scf.multi.domain.dto.Problem;
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
    private final ProblemService problemService;

    public List<MultiGameRoom> findAllRooms() {
        return multiGameRepository.findAllRooms();
    }

    public MultiGameRoom findOneById(String roomId) {
        return multiGameRepository.findOneById(roomId);
    }

    public String createRoom(Long userId) {

        String roomId = UUID.randomUUID().toString();

        MultiGameRoom room = MultiGameRoom.builder()
            .roomId(roomId)
            .hostId(userId)
            .isStart(false)
            .build();

        multiGameRepository.addRoom(room);
        return roomId;
    }

    public void deleteRoom(String roomId) {
        multiGameRepository.deleteRoom(roomId);
    }

    public void joinRoom(String roomId, Long userId, String username) {
        multiGameRepository.joinRoom(roomId, userId, username);
    }

    public void exitRoom(String roomId, Long userId) {
        multiGameRepository.exitRoom(roomId, userId);
    }

    public void markSolution(String roomId, Long userId, String content) {
    }

    public List<Problem> startGame(String roomId) {

        MultiGameRoom room = multiGameRepository.findOneById(roomId);

        List<Problem> problems = problemService.getProblems();

        room.gameStart(problems);

        return problems;
    }
}
