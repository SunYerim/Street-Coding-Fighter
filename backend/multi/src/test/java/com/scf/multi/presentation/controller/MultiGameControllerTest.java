package com.scf.multi.presentation.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scf.multi.application.MultiGameService;
import com.scf.multi.domain.dto.problem.Problem;
import com.scf.multi.domain.dto.room.CreateRoomDTO;
import com.scf.multi.domain.dto.user.Player;
import com.scf.multi.domain.model.MultiGameRoom;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(MultiGameController.class)
@ExtendWith(MockitoExtension.class)
class MultiGameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MultiGameService multiGameService;

    @Autowired
    private ObjectMapper objectMapper;

    private MultiGameRoom gameRoom;
    private Problem problem;
    private Player player;

    @BeforeEach
    void setUp() {
        problem = Problem.builder()
            .answer(Map.of(1, 2))
            .build();

        player = Player.builder()
            .userId(1L)
            .username("testUser")
            .isHost(false)
            .build();

        gameRoom = MultiGameRoom.builder()
            .roomId(UUID.randomUUID().toString())
            .hostId(1L)
            .title("Test Room")
            .maxPlayer(4)
            .password("1234")
            .build();
    }

    @Test
    @DisplayName("방 목록을 정상적으로 반환해야 한다.")
    void roomListTest() throws Exception {

        // Given
        List<MultiGameRoom> rooms = List.of(gameRoom);
        when(multiGameService.findAllRooms()).thenReturn(rooms);

        // When & Then
        mockMvc.perform(get("/multi/room"))
            .andExpect(status().isOk())
            .andExpect(content().json(objectMapper.writeValueAsString(rooms)));

        // Then
        verify(multiGameService, times(1)).findAllRooms();
    }

    @Test
    @DisplayName("특정 roomId에 대한 방 정보를 정상적으로 반환해야 한다.")
    void findRoomTest() throws Exception {

        // Given
        when(multiGameService.findOneById(gameRoom.getRoomId())).thenReturn(gameRoom);

        // When & Then
        mockMvc.perform(get("/multi/room/{roomId}", gameRoom.getRoomId()))
            .andExpect(status().isOk())
            .andExpect(content().json(objectMapper.writeValueAsString(gameRoom)));

        // Then
        verify(multiGameService, times(1)).findOneById(gameRoom.getRoomId());
    }

    @Test
    @DisplayName("특정 roomId에 대한 사용자 목록을 정상적으로 반환해야 한다.")
    void userInRoomTest() throws Exception {

        // Given
        gameRoom.add(gameRoom.getPassword(), player);
        when(multiGameService.findOneById(gameRoom.getRoomId())).thenReturn(gameRoom);

        // When & Then
        mockMvc.perform(get("/multi/room/{roomId}/user", gameRoom.getRoomId()))
            .andExpect(status().isOk())
            .andExpect(content().json(objectMapper.writeValueAsString(gameRoom.getPlayers())));

        // Then
        verify(multiGameService, times(1)).findOneById(gameRoom.getRoomId());
    }

    @Test
    @DisplayName("방을 성공적으로 생성해야 한다.")
    void createRoomTest() throws Exception {

        // Given
        CreateRoomDTO createRoomDTO = CreateRoomDTO.builder()
            .title("New Room")
            .maxPlayer(4)
            .password("password")
            .build();

        String generatedRoomId = "generated-room-id";
        when(multiGameService.createRoom(anyLong(), eq(createRoomDTO))).thenReturn(generatedRoomId);

        // When & Then
        MvcResult result = mockMvc.perform(post("/multi/room")
                .header("userId", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRoomDTO)))
            .andExpect(status().isOk())
            .andReturn();

        // Then
        verify(multiGameService, times(1)).createRoom(1L, createRoomDTO);
        String responseBody = result.getResponse().getContentAsString();
        assertThat(responseBody).isEqualTo(generatedRoomId);
    }

    @Test
    @DisplayName("사용자가 방에 성공적으로 참여해야 한다.")
    void joinRoomTest() throws Exception {

        // Given
        String roomId = "abc-def";
        String roomPassword = "1234";
        Long userId = 1L;
        String username = "testUser";

        // When & Then
        mockMvc.perform(post("/multi/room/{roomId}", roomId)
                .content(roomPassword)
                .contentType(MediaType.APPLICATION_JSON)
                .header("userId", userId)
                .header("username", username))
            .andExpect(status().isOk());

        // Then
        verify(multiGameService, times(1)).joinRoom(roomId, roomPassword, userId, username);
    }

    @Test
    @DisplayName("방장은 게임을 성공적으로 시작해야 한다.")
    void gameStartTest() throws Exception {

        // Given
        String roomId = "abc-def";
        Long userId = 1L;
        List<Problem> problems = List.of(problem);

        when(multiGameService.startGame(roomId, userId)).thenReturn(problems);

        // When & Then
        mockMvc.perform(post("/multi/game/{roomId}/start", roomId)
                .header("userId", userId))
            .andExpect(status().isOk())
            .andExpect(content().json(objectMapper.writeValueAsString(problems)));

        // Then
        verify(multiGameService, times(1)).startGame(roomId, userId);
    }
}

