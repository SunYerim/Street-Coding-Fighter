package com.scf.multi.domain.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.scf.multi.domain.dto.JoinRoomDTO;
import com.scf.multi.domain.dto.Problem;
import com.scf.multi.domain.dto.Rank;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MultiGameRoomTest {

    private MultiGameRoom gameRoom;

    @BeforeEach
    void setUp() {
        gameRoom = MultiGameRoom.builder()
            .roomId("room1")
            .hostId(1L)
            .isStart(false)
            .round(0)
            .password("1234")
            .maxPlayer(2)
            .build();
    }

    @Test
    @DisplayName("방에 플레이어가 정상적으로 추가되어야 한다.")
    void AddPlayerTest1() {

        // given
        Long userId = 1L;
        String username = "Player1";
        String roomPassword = "1234";

        // when
        joinRoom(userId, username, roomPassword);

        // then
        assertEquals(1, gameRoom.getPlayers().size());
        assertEquals("Player1", gameRoom.getPlayers().get(0).getUsername());
        assertEquals(0, gameRoom.getScoreBoard().get(userId));
    }

    @Test
    @DisplayName("방 비밀번호가 틀릴 경우 추가가 되면 안된다.")
    void AddPlayerTest2() {

        // given
        Long userId = 1L;
        String username = "Player1";
        String roomPassword = "1235";

        // when
        joinRoom(userId, username, roomPassword);

        // then
        assertEquals(0, gameRoom.getPlayers().size());
    }

    @Test
    @DisplayName("방 인원이 가득 찼을 경우 추가되면 안된다.")
    void AddPlayerTest3() {

        // given
        joinRoom(1L, "Player1", "1234");
        joinRoom(2L, "Player2", "1234");

        // when
        joinRoom(3L, "Player3", "1234");

        // then
        assertEquals(2, gameRoom.getPlayers().size());
    }

    @Test
    @DisplayName("방에서 플레이어가 정상적으로 제거되어야 한다.")
    void RemovePlayerTest() {

        // given
        Long userId = 1L;
        String username = "Player1";
        String roomPassword = "1234";
        joinRoom(userId, username, roomPassword);

        // when
        gameRoom.remove(1L);

        // then
        assertTrue(gameRoom.getPlayers().isEmpty());
    }

    @Test
    @DisplayName("게임이 시작할 때 게임방에 문제가 정상적으로 추가되어야 한다.")
    void GameStartTest() {

        // given
        List<Problem> problems = new ArrayList<>();
        problems.add(new Problem(1L, 0, "정렬", "버블 정렬", "버블 정렬 내용", Map.of(0, 1, 1, 2)));

        // when
        gameRoom.gameStart(problems, 1L);

        // then
        assertEquals(1, gameRoom.getProblems().size());

        Problem problem = gameRoom.getProblems().get(0);
        assertEquals(1, problem.getProblemId());
        assertEquals("정렬", problem.getCategory());
        assertEquals(2, problem.getAnswer().get(1));

        assertTrue(gameRoom.getIsStart());
    }

    @Test
    @DisplayName("플레이어에 대한 점수가 정상적으로 업데이트 되어야 한다.")
    void UpdateScoreTest() {
        // given
        Long userId = 1L;
        String username = "Player1";
        String roomPassword = "1234";
        joinRoom(userId, username, roomPassword);

        // when
        gameRoom.updateScore(1L, 10);

        // then
        assertEquals(10, gameRoom.getScoreBoard().get(1L));

        // when
        gameRoom.updateScore(1L, 15);

        // then
        assertEquals(25, gameRoom.getScoreBoard().get(1L));
    }

    @Test
    @DisplayName("라운드가 정상적으로 증가해야 한다.")
    void NextRoundTest() {

        // when
        gameRoom.nextRound();

        // then
        assertEquals(1, gameRoom.getRound());
    }

    @Test
    @DisplayName("순위가 정상적으로 계산되어야 한다.")
    void CalculateRankTest() {

        // given

        joinRoom(1L, "Player1", "1234");
        joinRoom(2L, "Player2", "1234");
        gameRoom.updateScore(1L, 30);
        gameRoom.updateScore(2L, 20);

        // when
        List<Rank> ranks = gameRoom.calculateRank();

        // then
        assertEquals(2, ranks.size());
        assertEquals(1L, ranks.get(0).getUserId());
        assertEquals(2L, ranks.get(1).getUserId());
        assertTrue(ranks.get(0).getScore() > ranks.get(1).getScore());
    }

    private void joinRoom(Long userId, String username, String roomPassword) {

        JoinRoomDTO joinRoomDTO = JoinRoomDTO.builder()
            .userId(userId)
            .username(username)
            .roomPassword(roomPassword)
            .build();

        if (!gameRoom.getPassword().equals(roomPassword)) {
            return;
        }

        if (gameRoom.getMaxPlayer() == gameRoom.getPlayers().size()) {
            return;
        }

        gameRoom.add(joinRoomDTO);
    }
}
