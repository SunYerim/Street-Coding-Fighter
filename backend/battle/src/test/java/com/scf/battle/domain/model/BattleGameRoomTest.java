package com.scf.battle.domain.model;

import com.scf.battle.domain.dto.FightDTO;
import com.scf.battle.domain.dto.Player;
import com.scf.battle.domain.dto.Problem;
import java.util.Arrays;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class BattleGameRoomTest {

    private BattleGameRoom battleGameRoom;
    private final Long hostId = 1L;
    private final String roomId = "room1";
    private final String title = "Test Room";
    private final String password = "pass";

    @BeforeEach
    public void setUp() {
        battleGameRoom = BattleGameRoom.builder()
            .roomId(roomId)
            .hostId(hostId)
            .title(title)
            .password(password)
            .isAttack(false)
            .isStart(false)
            .finalRound(0)
            .build();
    }

    @Test
    public void testAddPlayer() {
        // Given
        Long userId1 = 2L;
        String username1 = "PlayerA";
        Long userId2 = 3L;
        String username2 = "PlayerB";

        // When
        battleGameRoom.add(userId1, username1, password);
        battleGameRoom.add(userId2, username2, password);

        // Then
        assertNotNull(battleGameRoom.getPlayerA());
        assertNotNull(battleGameRoom.getPlayerB());
        assertEquals(username1, battleGameRoom.getPlayerA().getUsername());
        assertEquals(username2, battleGameRoom.getPlayerB().getUsername());
    }

    @Test
    public void testStartGame() {
        // Given
        List<Problem> problems = new ArrayList<>();
        problems.add(new Problem(1L, 0, "정렬", "버블 정렬", "버블 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(2L, 0, "정렬", "삽입 정렬", "삽입 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(3L, 0, "정렬", "선택 정렬", "선택 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(4L, 0, "정렬", "퀵 정렬", "퀵 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(5L, 0, "정렬", "병합 정렬", "병합 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(6L, 0, "정렬", "힙 정렬", "힙 정렬 내용", Map.of(0, 1, 1, 2)));

        Long userId1 = 2L;
        String username1 = "PlayerA";
        Long userId2 = 3L;
        String username2 = "PlayerB";
        battleGameRoom.add(userId1, username1, password);
        battleGameRoom.add(userId2, username2, password);

        // When
        battleGameRoom.startGame(problems, hostId);

        // Then
        assertTrue(battleGameRoom.getIsStart());
        assertEquals(2, battleGameRoom.getRoundProblems().size());
        assertEquals(3, battleGameRoom.getRoundProblems().get(0).size());
    }

    @Test
    public void testUpdateHp() {
        // Given
        Long userId1 = 2L;
        String username1 = "PlayerA";
        Long userId2 = 3L;
        String username2 = "PlayerB";
        battleGameRoom.add(userId1, username1, password);
        battleGameRoom.add(userId2, username2, password);
        battleGameRoom.startGame(new ArrayList<>(), hostId);

        // When
        FightDTO fightDTO = battleGameRoom.updateHp(userId1, 10);

        // Then
        assertEquals(userId1, fightDTO.getUserId());
        assertTrue(fightDTO.getIsAttack());
        assertEquals(10, fightDTO.getPower());
        assertEquals(90, battleGameRoom.getPlayerB().getHp());
    }

    @Test
    public void testGetProblemsForRound() {
        // Given
        List<Problem> problems = new ArrayList<>();
        problems.add(new Problem(1L, 0, "정렬", "버블 정렬", "버블 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(2L, 0, "정렬", "삽입 정렬", "삽입 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(3L, 0, "정렬", "선택 정렬", "선택 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(4L, 0, "정렬", "퀵 정렬", "퀵 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(5L, 0, "정렬", "병합 정렬", "병합 정렬 내용", Map.of(0, 1, 1, 2)));
        problems.add(new Problem(6L, 0, "정렬", "힙 정렬", "힙 정렬 내용", Map.of(0, 1, 1, 2)));

        Long userId1 = 2L;
        String username1 = "PlayerA";
        Long userId2 = 3L;
        String username2 = "PlayerB";
        battleGameRoom.add(userId1, username1, password);
        battleGameRoom.add(userId2, username2, password);
        battleGameRoom.startGame(problems, hostId);

        // When
        List<Problem> round1Problems = battleGameRoom.getProblemsForRound(1);

        // Then
        assertEquals(3, round1Problems.size());
    }

    @Test
    public void testNextRound() {
        // Given

        // When
        battleGameRoom.nextRound();

        // Then
        assertEquals(1, battleGameRoom.getRound());
        assertFalse(battleGameRoom.getIsAttack());
    }
}
