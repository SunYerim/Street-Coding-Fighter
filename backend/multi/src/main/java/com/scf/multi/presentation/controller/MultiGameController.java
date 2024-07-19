package com.scf.multi.presentation.controller;

import com.scf.multi.application.MultiGameService;
import com.scf.multi.domain.model.MultiGameRoom;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/multi")
public class MultiGameController {

    private final MultiGameService multiGameService;

    @GetMapping
    public ResponseEntity<?> roomList() {
        List<MultiGameRoom> rooms = multiGameService.findAllRooms();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @PostMapping("/room/{userId}")
    public ResponseEntity<?> createRoom(@PathVariable Long userId) {
        String roomId = multiGameService.createRoom(userId);
        return new ResponseEntity<>(roomId, HttpStatus.OK);
    }

    @PostMapping("/room/{roomId}/{userId}/{username}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId, @PathVariable Long userId, @PathVariable String username) {
        multiGameService.joinRoom(roomId, userId, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/multi/game/{roomId}")
    public ResponseEntity<?> gameStart(@PathVariable String roomId) {
        multiGameService.startGame(roomId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
