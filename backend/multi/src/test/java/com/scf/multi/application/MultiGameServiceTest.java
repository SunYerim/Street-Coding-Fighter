package com.scf.multi.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.scf.multi.domain.dto.problem.Problem;
import com.scf.multi.domain.dto.problem.ProblemInfo;
import com.scf.multi.domain.dto.room.CreateRoomDTO;
import com.scf.multi.domain.dto.user.Player;
import com.scf.multi.domain.dto.user.Solved;
import com.scf.multi.domain.model.MultiGameRoom;
import com.scf.multi.domain.repository.MultiGameRepository;
import com.scf.multi.global.error.ErrorCode;
import com.scf.multi.global.error.exception.BusinessException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class MultiGameServiceTest {

    @Mock
    private MultiGameRepository multiGameRepository;

    @Mock
    private ProblemService problemService;

    @InjectMocks
    private MultiGameService multiGameService;

    private MultiGameRoom gameRoom;
    private CreateRoomDTO createRoomDTO;

    @BeforeEach
    void setUp() {

        MockitoAnnotations.openMocks(this);

        gameRoom = MultiGameRoom.builder()
            .roomId("abc-def")
            .hostId(1L)
            .hostname("testUser")
            .title("First Room")
            .maxPlayer(2)
            .password("1234")
            .build();

        createRoomDTO = CreateRoomDTO.builder()
            .title("First Room")
            .maxPlayer(2)
            .password("1234")
            .build();
    }

    @Test
    @DisplayName("방의 목록을 정상적으로 반환해야 한다.")
    void findAllRoomsTest() {

        // Given
        when(multiGameRepository.findAllRooms()).thenReturn(List.of(gameRoom));

        // When
        List<MultiGameRoom> rooms = multiGameService.findAllRooms();

        // Then
        assertThat(rooms).hasSize(1);
        assertThat(rooms).contains(gameRoom);
    }

    @Test
    @DisplayName("roomId에 해당하는 방을 정상적으로 반환해야 한다.")
    void findOneByIdTest() {

        // Given
        when(multiGameRepository.findOneById("abc-def")).thenReturn(gameRoom);

        // When
        MultiGameRoom room = multiGameService.findOneById("abc-def");

        // Then
        assertThat(room).isNotNull();
        assertThat(room.getRoomId()).isEqualTo("abc-def");
    }

    @Test
    @DisplayName("존재하지 않는 roomId에 대해 예외를 발생시켜야 한다.")
    void findOneByIdNotFoundTest() {

        // Given
        when(multiGameRepository.findOneById("non-existent")).thenReturn(null);

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            multiGameService.findOneById("non-existent");
        });

        assertThat(exception.getMessage()).isEqualTo(ErrorCode.ROOM_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("새로운 방을 정상적으로 생성해야 한다.")
    void createRoomTest() {

        // Given
        Long userId = 1L;
        String username = "hongKD";

        // When
        String roomId = multiGameService.createRoom(userId, username, createRoomDTO);

        // Then
        assertThat(roomId).isNotNull();
        verify(multiGameRepository).addRoom(any(MultiGameRoom.class));
    }

    @Test
    @DisplayName("roomId에 해당하는 방을 정상적으로 삭제해야 한다.")
    void deleteRoomTest() {

        // Given
        when(multiGameRepository.findOneById("abc-def")).thenReturn(gameRoom);

        // When
        multiGameService.deleteRoom("abc-def");

        // Then
        verify(multiGameRepository).deleteRoom("abc-def");
    }

    @Test
    @DisplayName("존재하지 않는 roomId에 대해 예외를 발생시켜야 한다.")
    void deleteRoomNotFoundTest() {

        // Given
        when(multiGameRepository.findOneById("non-existent")).thenReturn(null);

        // When
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            multiGameService.deleteRoom("non-existent");
        });

        assertThat(exception.getMessage()).isEqualTo(ErrorCode.ROOM_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("유저가 방에 정상적으로 참여해야 한다.")
    void joinRoomTest() {

        // Given
        when(multiGameRepository.findOneById("abc-def")).thenReturn(gameRoom);
        Long userId = 2L;
        String username = "player1";

        // When
        multiGameService.joinRoom("abc-def", "1234", userId, username);

        // Then
        assertThat(gameRoom.getPlayers()).hasSize(1);
        Player player = gameRoom.getPlayers().get(0);
        assertThat(player.getUserId()).isEqualTo(userId);
        assertThat(player.getUsername()).isEqualTo(username);
        assertThat(player.getIsHost()).isFalse();
    }

    @Test
    @DisplayName("방장이 방에 참여할 때 isHost가 true로 설정되어야 한다.")
    void joinRoomAsHostTest() {
        // Given
        when(multiGameRepository.findOneById("abc-def")).thenReturn(gameRoom);
        Long userId = 1L;
        String username = "host";

        // When
        multiGameService.joinRoom("abc-def", "1234", userId, username);

        // Then
        assertThat(gameRoom.getPlayers()).hasSize(1);
        Player player = gameRoom.getPlayers().get(0);
        assertThat(player.getUserId()).isEqualTo(userId);
        assertThat(player.getUsername()).isEqualTo(username);
        assertThat(player.getIsHost()).isTrue();
    }

    @Test
    @DisplayName("유저가 방에서 정상적으로 나가야 한다.")
    void exitRoomTest() {

        // Given
        Player player = Player.builder()
            .userId(2L)
            .username("player1")
            .isHost(false)
            .build();
        gameRoom.add("1234", player);

        when(multiGameRepository.findOneById("abc-def")).thenReturn(gameRoom);

        // When
        multiGameService.exitRoom("abc-def", 2L);

        // Then
        assertThat(gameRoom.getPlayers()).isEmpty();
    }

    @Test
    @DisplayName("정답을 제출하고 점수를 정상적으로 계산해야 한다.")
    void markSolutionTest() {

        // Given
        Problem problem = Problem.builder()
            .answer(Map.of(1, 2, 2, 3))
            .build();

        when(multiGameRepository.findOneById("abc-def")).thenReturn(gameRoom);

        Player player1 = Player.builder().userId(1L).username("host").isHost(true).streakCount(0).build();
        Player player2 = Player.builder().userId(2L).username("player").isHost(false).streakCount(0).build();
        gameRoom.add("1234", player1);
        gameRoom.add("1234", player2);
        gameRoom.gameStart(List.of(problem), 1L);

        Solved solved = Solved.builder()
            .solve(Map.of(1, 2, 2, 3))
            .submitTime(5)
            .build();

        // When
        int score = multiGameService.markSolution("abc-def", player1, solved);
        int ans = 1000 * (solved.getSubmitTime() / 30) + (player1.getStreakCount() * 75);

        // Then
        assertThat(score).isEqualTo(ans);
        verify(multiGameRepository).findOneById("abc-def");
        assertThat(gameRoom.getScoreBoard().get(1L)).isEqualTo(ans);
    }

    @Test
    @DisplayName("방장은 게임을 시작할 수 있어야 하며, 문제들이 정상적으로 설정되어야 한다.")
    void startGameTest() {

        // Given
        List<Problem> problems = List.of(
            Problem.builder().answer(Map.of(1, 2)).build(),
            Problem.builder().answer(Map.of(1, 3)).build()
        );

        when(multiGameRepository.findOneById("abc-def")).thenReturn(gameRoom);

        gameRoom.add("1234", Player.builder().userId(1L).username("Host").isHost(true).build());
        gameRoom.add("1234", Player.builder().userId(2L).username("Player").isHost(false).build());

        when(problemService.getProblems()).thenReturn(problems);

        // When
        List<ProblemInfo> startedProblems = multiGameService.startGame("abc-def", 1L);

        // Then
        assertThat(startedProblems).isEqualTo(problems.stream()
            .map(problem -> ProblemInfo.builder()
                .problemId(problem.getProblemId())
                .type(problem.getType())
                .title(problem.getTitle())
                .category(problem.getCategory())
                .content(problem.getContent())
                .build())
            .toList());
        assertThat(gameRoom.getProblems()).isEqualTo(problems);
        assertThat(gameRoom.getIsStart()).isTrue();
    }

    @Test
    @DisplayName("정답이 없을 경우 점수가 0이 되어야 한다.")
    void markSolutionNoCorrectAnswersTest() {

        // Given
        List<Problem> problems = List.of(
            Problem.builder().problemId(1L).answer(Map.of(1, 2, 2, 3)).build(),
            Problem.builder().problemId(2L).answer(Map.of(2, 3)).build()
        );


        Player player1 = Player.builder().userId(1L).username("host").isHost(true).streakCount(0).build();
        Player player2 = Player.builder().userId(2L).username("player").isHost(false).streakCount(0).build();
        gameRoom.add("1234", player1);
        gameRoom.add("1234", player2);
        gameRoom.gameStart(problems, 1L);

        when(multiGameRepository.findOneById("abc-def")).thenReturn(gameRoom);

        Solved solved = Solved.builder()
            .problemId(1L)
            .solve(Map.of(1, 3, 2, 1))
            .submitTime(5)
            .build();

        // When
        int score = multiGameService.markSolution("abc-def", player1, solved);

        // Then
        assertThat(score).isEqualTo(0);
    }

    @Test
    @DisplayName("문제가 없을 경우 예외를 발생시켜야 한다.")
    void startGameNoProblemsTest() {

        // Given
        when(problemService.getProblems()).thenReturn(Collections.emptyList());
        when(multiGameRepository.findOneById("abc-def")).thenReturn(gameRoom);

        // When
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            multiGameService.startGame("abc-def", 1L);
        });

        // Then
        assertThat(exception.getMessage()).isEqualTo(ErrorCode.PROBLEM_NOT_FOUND.getMessage());
    }
}

