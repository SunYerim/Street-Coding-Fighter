package com.scf.battle.application;

import com.scf.battle.domain.dto.Problem.Problem;
import com.scf.battle.domain.dto.Room.CreateRoomDTO;
import com.scf.battle.domain.dto.User.FightDTO;
import com.scf.battle.domain.dto.User.Player;
import com.scf.battle.domain.dto.User.Solved;
import com.scf.battle.domain.model.BattleGameRoom;
import com.scf.battle.domain.repository.BattleGameRepository;

import com.scf.battle.global.error.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BattleGameServiceTest {

    @Mock
    private BattleGameRepository battleGameRepository;

    @Mock
    private ProblemService problemService;

    @InjectMocks
    private BattleGameService battleGameService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllRooms() {
        // given
        BattleGameRoom room1 = BattleGameRoom.builder().build();
        BattleGameRoom room2 = BattleGameRoom.builder().build();
        when(battleGameRepository.findAllRooms()).thenReturn(Arrays.asList(room1, room2));

        // when
        List<BattleGameRoom> rooms = battleGameService.findAllRooms();

        // then
        assertEquals(2, rooms.size());
        verify(battleGameRepository, times(1)).findAllRooms();
    }

    @Test
    void testFindById() {
        // given
        String roomId = UUID.randomUUID().toString();
        BattleGameRoom room = BattleGameRoom.builder().build();
        when(battleGameRepository.findById(roomId)).thenReturn(room);

        // when
        BattleGameRoom foundRoom = battleGameService.findById(roomId);

        // then
        assertNotNull(foundRoom);
        verify(battleGameRepository, times(1)).findById(roomId);
    }

    @Test
    void testJoinRoomRoomNotFound() {
        // given
        String roomId = UUID.randomUUID().toString();
        when(battleGameRepository.findById(roomId)).thenReturn(null);

        // when
        BusinessException exception = assertThrows(BusinessException.class, () ->
                battleGameService.joinRoom(roomId, 1L, "user1", "password"));

        // then
        verify(battleGameRepository, times(1)).findById(roomId);
    }

    @Test
    void testCreateRoom() {
        // given
        Long memberId = 1L;
        String username = "user1";
        CreateRoomDTO createRoomDTO = CreateRoomDTO.builder()
                .round(3)
                .title("Test Room")
                .password("password")
                .build();
        String roomId = UUID.randomUUID().toString();
        doNothing().when(battleGameRepository).addRoom(any(BattleGameRoom.class));

        // when
        String resultRoomId = battleGameService.createRoom(memberId, username, createRoomDTO);

        // then
        assertNotNull(resultRoomId);
        verify(battleGameRepository, times(1)).addRoom(any(BattleGameRoom.class));
    }

    @Test
    void testStartGame() {
        // given
        Long userId = 1L;
        String roomId = UUID.randomUUID().toString();
        BattleGameRoom room = BattleGameRoom.builder()
                .hostId(userId)
                .playerA(new Player(1L, "playerA", 100))
                .playerB(new Player(2L, "playerB", 100))
                .finalRound(3)
                .isStart(false)
                .build();
        when(battleGameRepository.findById(roomId)).thenReturn(room);
        when(problemService.getProblems(anyInt())).thenReturn(Arrays.asList(new Problem(), new Problem(), new Problem()));

        // when
        List<Problem> problems = battleGameService.startGame(userId, roomId);

        // then
        assertEquals(3, problems.size());
        verify(battleGameRepository, times(1)).findById(roomId);
        verify(problemService, times(1)).getProblems(anyInt());
    }

    @Test
    void testCalculateScore() {
        // given
        int submitTime = 25;

        // when
        int score = battleGameService.calculateScore(submitTime);

        // then
        assertTrue(score > 0);
    }

//    @Test
//    void testMarkSolution() {
//        // given
//        String roomId = UUID.randomUUID().toString();
//        Long userId = 1L;
//        Solved solved = new Solved();
//        solved.setRound(0);
//        solved.setProblemId(1L);
//        solved.setSubmitTime(20);
//
//        BattleGameRoom room = BattleGameRoom.builder()
//                .playerA(new Player(1L, "playerA", 100))
//                .playerB(new Player(2L, "playerB", 100))
//                .isStart(true)
//                .build();
//        room.getRoundProblems().add(Arrays.asList(new Problem(), new Problem()));
//        when(battleGameRepository.findById(roomId)).thenReturn(room);
//
//        // when
//        FightDTO fightDTO = battleGameService.markSolution(roomId, userId, solved);
//
//        // then
//        assertNotNull(fightDTO);
//        verify(battleGameRepository, times(1)).findById(roomId);
//    }

    @Test
    void testIsRoundOver() {
        // given
        String roomId = UUID.randomUUID().toString();
        BattleGameRoom room = BattleGameRoom.builder()
                .hasPlayerASubmitted(true)
                .hasPlayerBSubmitted(true)
                .build();
        when(battleGameRepository.findById(roomId)).thenReturn(room);

        // when
        boolean isRoundOver = battleGameService.isRoundOver(roomId);

        // then
        assertTrue(isRoundOver);
        verify(battleGameRepository, times(1)).findById(roomId);
    }

    @Test
    void testRunRound() {
        // given
        String roomId = UUID.randomUUID().toString();
        BattleGameRoom room = BattleGameRoom.builder()
                .currentRound(0)
                .finalRound(3)
                .isStart(true)
                .build();
        when(battleGameRepository.findById(roomId)).thenReturn(room);

        // when
        Integer currentRound = battleGameService.runRound(roomId);

        // then
        assertEquals(1, currentRound);
        verify(battleGameRepository, times(1)).findById(roomId);
    }

//    @Test
//    void testGetCurrentRoundProblem() {
//        // given
//        String roomId = UUID.randomUUID().toString();
//        Integer currentRound = 0;
//        BattleGameRoom room = BattleGameRoom.builder()
//                .isStart(true)
//                .build();
//        room.getRoundProblems().add(Arrays.asList(new Problem(), new Problem()));
//        when(battleGameRepository.findById(roomId)).thenReturn(room);
//        when(room.getProblemsForRound(currentRound)).thenReturn(Arrays.asList(new Problem(), new Problem()));
//
//        // when
//        List<Problem> problems = battleGameService.getCurrentRoundProblem(roomId, currentRound);
//
//        // then
//        assertEquals(2, problems.size());
//        verify(battleGameRepository, times(1)).findById(roomId);
//    }
}
