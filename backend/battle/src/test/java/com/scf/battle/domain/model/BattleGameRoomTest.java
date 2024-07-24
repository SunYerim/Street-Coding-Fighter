package com.scf.battle.domain.model;

import com.scf.battle.domain.dto.JoinRoomDTO;
import com.scf.battle.domain.dto.Player;
import com.scf.battle.domain.dto.Problem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class BattleGameRoomTest {

    private BattleGameRoom room;

    @BeforeEach
    public void setUp() {
        room = BattleGameRoom.builder()
            .roomId("room1")
            .hostId(1L)
            .title("Test Room")
            .password("1234")
            .isStart(false)
            .round(0)
            .build();
    }

    @Test
    public void testAddPlayer() {
        JoinRoomDTO joinRoomDTO = JoinRoomDTO.builder()
            .userId(1L)
            .username("user1")
            .roomPassword("1234")
            .build();

        room.add(joinRoomDTO);

        List<Player> players = room.getPlayers();
        assertEquals(1, players.size());
        assertEquals("user1", players.get(0).getUsername());
    }

    @Test
    public void testStartGame() {
        Map<Integer, Integer> answer = new HashMap<>();
        answer.put(1, 2);
        Problem problem = new Problem(1L, 1, "Category", "Title", "Content", answer);

        List<Problem> problems = new ArrayList<>();
        problems.add(problem);

        room.startGame(problems, 1L);

        assertTrue(room.getIsStart());
        assertEquals(1, room.getProblems().size());
        assertEquals(problem, room.getProblems().get(0));
    }
}
