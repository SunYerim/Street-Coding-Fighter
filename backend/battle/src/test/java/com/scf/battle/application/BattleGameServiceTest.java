package com.scf.battle.application;

import com.scf.battle.domain.dto.CreateRoomDTO;
import com.scf.battle.domain.dto.FightDTO;
import com.scf.battle.domain.dto.Problem;
import com.scf.battle.domain.dto.Solved;
import com.scf.battle.domain.model.BattleGameRoom;
import com.scf.battle.domain.repository.BattleGameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class BattleGameServiceTest {

    @Mock
    private BattleGameRepository battleGameRepository;

    @Mock
    private ProblemService problemService;

    @InjectMocks
    private BattleGameService battleGameService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindAllRooms() {
        // Given
        List<BattleGameRoom> rooms = new ArrayList<>();
        when(battleGameRepository.findAllRooms()).thenReturn(rooms);

        // When
        List<BattleGameRoom> result = battleGameService.findAllRooms();

        // Then
        assertEquals(rooms, result);
    }

    @Test
    public void testFindById() {
        // Given
        String roomId = UUID.randomUUID().toString();
        BattleGameRoom room = BattleGameRoom.builder().roomId(roomId).build();
        when(battleGameRepository.findById(roomId)).thenReturn(room);

        // When
        BattleGameRoom result = battleGameService.findById(roomId);

        // Then
        assertEquals(room, result);
    }

    @Test
    public void testJoinRoom() {
        // Given
        String roomId = UUID.randomUUID().toString();
        Long userId = 1L;
        String username = "user";
        String roomPassword = "password";

        // When
        battleGameService.joinRoom(roomId, userId, username, roomPassword);

        // Then
        verify(battleGameRepository, times(1)).joinRoom(roomId, userId, username, roomPassword);
    }

    @Test
    public void testCreateRoom() {
        // Given
        Long userId = 1L;
        CreateRoomDTO createRoomDTO = CreateRoomDTO.builder()
            .title("Test Room")
            .password("password")
            .build();
        String roomId = UUID.randomUUID().toString();
        doNothing().when(battleGameRepository).addRoom(any(BattleGameRoom.class));

        // When
        String result = battleGameService.createRoom(userId, createRoomDTO);

        // Then
        assertNotNull(result);
    }

    @Test
    public void testStartGame() {
        // Given
        Long userId = 1L;
        String roomId = UUID.randomUUID().toString();
        BattleGameRoom room = BattleGameRoom.builder().roomId(roomId).hostId(userId).build();
        List<Problem> problems = new ArrayList<>();
        problems.add(new Problem(1L, 0, "정렬", "버블 정렬", "버블 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(2L, 0, "정렬", "삽입 정렬", "삽입 정렬 내용", Map.of(0, 1, 1, 2)));

        when(battleGameRepository.findById(roomId)).thenReturn(room);
        when(problemService.getProblem()).thenReturn(problems);

        // When
        List<Problem> result = battleGameService.startGame(userId, roomId);

        // Then
        assertNotNull(result);
        assertTrue(room.getIsStart());
    }

    @Test
    public void testMarkSolution() {
        // Given
        String roomId = UUID.randomUUID().toString();
        Long userId = 1L;
        Solved solved = Solved.builder()
            .problemId(1L)
            .userId(userId)
            .solve(Map.of(0, 1, 1, 2))
            .submitTime(5)
            .build();

        BattleGameRoom room = BattleGameRoom.builder()
            .roomId(roomId)
            .round(1)
            .isStart(true)
            .build();

        room.setRoundProblems(List.of(
            List.of(
                new Problem(1L, 0, "정렬", "버블 정렬", "버블 정렬 내용", Map.of(0, 1, 1, 2))
            )
        ));

        when(battleGameRepository.findById(roomId)).thenReturn(room);

        // When
        FightDTO result = battleGameService.markSolution(roomId, userId, solved);

        // Then
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertTrue(result.getIsAttack());
    }
}
