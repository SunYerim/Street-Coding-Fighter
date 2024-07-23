package com.scf.battle.application;

import com.scf.battle.domain.dto.CreateRoomDTO;
import com.scf.battle.domain.dto.JoinRoomDTO;
import com.scf.battle.domain.dto.Problem;
import com.scf.battle.domain.model.BattleGameRoom;
import com.scf.battle.domain.repository.BattleGameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

public class BattleGameServiceTest {

    @Mock
    private BattleGameRepository battleGameRepository;

    @InjectMocks
    private BattleGameService battleGameService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindAllRooms() {
        given(battleGameRepository.findAllRooms()).willReturn(Collections.emptyList());

        List<BattleGameRoom> rooms = battleGameService.findAllRooms();

        assertTrue(rooms.isEmpty());
        verify(battleGameRepository).findAllRooms();
    }

    @Test
    public void testFindById() {
        BattleGameRoom room = BattleGameRoom.builder().roomId("room1").hostId(1L).build();
        given(battleGameRepository.findById(anyString())).willReturn(room);

        BattleGameRoom foundRoom = battleGameService.findById("room1");

        assertNotNull(foundRoom);
        assertEquals("room1", foundRoom.getRoomId());
        verify(battleGameRepository).findById("room1");
    }

    @Test
    public void testJoinRoom() {
        JoinRoomDTO joinRoomDTO = JoinRoomDTO.builder()
            .userId(1L)
            .username("user1")
            .roomPassword("1234")
            .build();

        battleGameService.joinRoom("room1", joinRoomDTO);

        verify(battleGameRepository).joinRoom("room1", joinRoomDTO);
    }

    @Test
    public void testCreateRoom() {
        CreateRoomDTO createRoomDTO = CreateRoomDTO.builder()
            .title("Test Room")
            .password("1234")
            .build();

        String roomId = battleGameService.createRoom(1L, createRoomDTO);

        assertNotNull(roomId);
        verify(battleGameRepository).addRoom(any(BattleGameRoom.class));
    }

//    @Test
//    public void testStartGame() {
//        Map<Integer, Integer> answer = new HashMap<>();
//        answer.put(1, 2);
//        Problem problem = new Problem(1L, 1, "Category", "Title", "Content", answer);
//
//        List<Problem> problems = new ArrayList<>();
//        problems.add(problem);
//
//        BattleGameRoom room = BattleGameRoom.builder()
//            .roomId("room1")
//            .hostId(1L)
//            .title("Test Room")
//            .password("1234")
//            .isStart(false)
//            .round(0)
//            .build();
//
//        given(battleGameRepository.findById(anyString())).willReturn(room);
//
//        battleGameService.startGame(1L, "room1");
//
//        assertTrue(room.getIsStart());
//        assertEquals(1, room.getProblems().size());
//        assertEquals(problem, room.getProblems().get(0));
//
//        verify(battleGameRepository).findById("room1");
//    }
}
