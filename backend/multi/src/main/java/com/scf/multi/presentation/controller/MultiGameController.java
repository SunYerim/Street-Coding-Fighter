package com.scf.multi.presentation.controller;

import com.scf.multi.application.MultiGameService;
import com.scf.multi.domain.dto.room.RoomRequest;
import com.scf.multi.domain.dto.room.RoomResponse;
import com.scf.multi.domain.dto.user.GameResult;
import com.scf.multi.domain.dto.user.Player;
import com.scf.multi.domain.dto.user.Rank;
import com.scf.multi.domain.dto.user.Solved;
import com.scf.multi.domain.model.MultiGameRoom;
import com.scf.multi.infrastructure.KafkaMessageProducer;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/multi")
public class MultiGameController {

    private final MultiGameService multiGameService;
    private final KafkaMessageProducer kafkaMessageProducer;

    @GetMapping("/room")
    public ResponseEntity<List<RoomResponse.ListDTO>> roomList() {
        List<RoomResponse.ListDTO> rooms = multiGameService.findAllRooms();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> findRoom(@PathVariable String roomId) {
        MultiGameRoom room = multiGameService.findOneById(roomId);
        return new ResponseEntity<>(room, HttpStatus.OK);
    }

    @GetMapping("/room/{roomId}/user")
    public ResponseEntity<?> userInRoom(@PathVariable String roomId) {
        MultiGameRoom room = multiGameService.findOneById(roomId);
        List<Player> players = room.getPlayers();
        return new ResponseEntity<>(players, HttpStatus.OK);
    }

    @PostMapping("/room")
    public ResponseEntity<?> createRoom(@RequestHeader Long memberId, @RequestHeader String username,
        @RequestBody @Valid RoomRequest.CreateRoomDTO createRoomDTO) {
        String roomId = multiGameService.createRoom(memberId, username, createRoomDTO);
        return new ResponseEntity<>(roomId, HttpStatus.OK);
    }

    @PostMapping("/room/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId,
        @Valid @RequestBody String roomPassword, @RequestHeader Long memberId,
        @RequestHeader String username) {
        multiGameService.joinRoom(roomId, roomPassword, memberId, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/game/{roomId}/start")
    public ResponseEntity<Void> gameStart(@PathVariable String roomId, @RequestHeader Long memberId) {

        multiGameService.startGame(roomId, memberId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/kafka/test")
    public ResponseEntity<Void> test() {

        Rank hermesRank = Rank.builder()
            .userId(85L)
            .username("Hermes")
            .score(150)
            .build();

        Rank jackRank = Rank.builder()
            .userId(2L)
            .username("Jack")
            .score(100)
            .build();

        Solved hermesSolved1 = Solved.builder() // 주관식
            .solveText("hermes test answer")
            .problemId(1L)
            .userId(85L)
            .solve(null)
            .submitTime(10)
            .build();

        Solved hermesSolved2 = Solved.builder() // 빈칸
            .solveText(null)
            .problemId(2L)
            .userId(85L)
            .solve(Map.of(1, 1, 2, 2))
            .submitTime(10)
            .build();

        Solved jackSolved1 = Solved.builder() // 주관식
            .solveText("jack test answer")
            .problemId(1L)
            .userId(1L)
            .solve(null)
            .submitTime(10)
            .build();

        Solved jackSolved2 = Solved.builder() // 빈칸
            .solveText(null)
            .problemId(2L)
            .userId(1L)
            .solve(Map.of(1, 4, 2, 1))
            .submitTime(20)
            .build();

        GameResult gameResult = GameResult.builder()
            .gameRank(List.of(hermesRank, jackRank))
            .build();

        kafkaMessageProducer.sendResult(gameResult);
        kafkaMessageProducer.sendSolved(List.of(hermesSolved1, hermesSolved2));
        kafkaMessageProducer.sendSolved(List.of(jackSolved1, jackSolved2));

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
