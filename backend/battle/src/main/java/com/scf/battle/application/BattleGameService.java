package com.scf.battle.application;

import com.scf.battle.domain.dto.CreateRoomDTO;
import com.scf.battle.domain.dto.JoinRoomDTO;
import com.scf.battle.domain.dto.Problem;
import com.scf.battle.domain.model.BattleGameRoom;
import com.scf.battle.domain.repository.BattleGameRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BattleGameService {
    private final BattleGameRepository battleGameRepository;

    public List<BattleGameRoom> findAllRooms() {
        return battleGameRepository.findAllRooms();
    }

    public BattleGameRoom findById(String roomId) {
        return battleGameRepository.findById(roomId);
    }

    public void joinRoom(String roomId, JoinRoomDTO joinRoomDto) {
        battleGameRepository.joinRoom(roomId, joinRoomDto);
    }

    public String createRoom(Long userId, CreateRoomDTO createRoomDTO) {
        String roomId = UUID.randomUUID().toString();

        BattleGameRoom room = BattleGameRoom.builder()
            .roomId(roomId)
            .hostId(userId)
            .isStart(false)
            .round(0)
            .title(createRoomDTO.getTitle())
            .password(createRoomDTO.getPassword())
            .build();

        battleGameRepository.addRoom(room);
        return roomId;
    }

    public List<Problem> startGame(Long userId, String roomId) {
        BattleGameRoom room = battleGameRepository.findById(roomId);
        if(room == null){
            // 예외처리
        }

        List<Problem> problems = new ArrayList<>(); // problem service 추가

        room.startGame(problems, userId);

        return problems;
    }
}
