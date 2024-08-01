package com.scf.multi.presentation.controller;

import com.scf.multi.application.MultiGameService;
import com.scf.multi.domain.dto.problem.ProblemInfo;
import com.scf.multi.domain.dto.room.CreateRoomDTO;
import com.scf.multi.domain.dto.user.Player;
import com.scf.multi.domain.model.MultiGameRoom;
import jakarta.validation.Valid;
import java.util.List;
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

    @GetMapping("/room")
    public ResponseEntity<?> roomList() {
        List<MultiGameRoom> rooms = multiGameService.findAllRooms();
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
    public ResponseEntity<?> createRoom(@RequestHeader Long userId,
        @RequestBody @Valid CreateRoomDTO createRoomDTO) {
        String roomId = multiGameService.createRoom(userId, createRoomDTO);
        return new ResponseEntity<>(roomId, HttpStatus.OK);
    }

    @PostMapping("/room/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId,
        @Valid @RequestBody String roomPassword, @RequestHeader Long userId,
        @RequestHeader String username) {
        multiGameService.joinRoom(roomId, roomPassword, userId, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/game/{roomId}/start")
    public ResponseEntity<?> gameStart(@PathVariable String roomId, @RequestHeader Long userId) {

        List<ProblemInfo> problems = multiGameService.startGame(roomId, userId);

        return new ResponseEntity<>(problems, HttpStatus.OK);
    }
}
