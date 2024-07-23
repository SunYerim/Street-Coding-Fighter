package com.scf.battle.presentation.controller;

import com.scf.battle.application.BattleGameService;
import com.scf.battle.domain.dto.CreateRoomDTO;
import com.scf.battle.domain.dto.JoinRoomDTO;
import com.scf.battle.domain.dto.Problem;
import com.scf.battle.domain.model.BattleGameRoom;
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

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/battle")
public class BattleGameController {

    private final BattleGameService battleGameService;

    @GetMapping("/room")
    public ResponseEntity<?> roomList() {
        List<BattleGameRoom> rooms = battleGameService.findAllRooms();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> findRoom(@PathVariable String roomId) {
        BattleGameRoom battleGameRoom = battleGameService.findById(roomId);
        return new ResponseEntity<>(battleGameRoom, HttpStatus.OK);
    }

    @PostMapping("/room/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId, @RequestBody JoinRoomDTO joinRoomDto) {
        battleGameService.joinRoom(roomId, joinRoomDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/room")
    public ResponseEntity<?> createRoom(@RequestHeader Long userId, @RequestBody CreateRoomDTO createRoomDto){
        String roomId = battleGameService.createRoom(userId, createRoomDto);
        return new ResponseEntity<>(roomId, HttpStatus.OK);
    }

    @PostMapping("/room/{roomId}/start")
    public ResponseEntity<?> gameStart(@RequestHeader Long userId, @PathVariable String roomId){
        List<Problem> problems = battleGameService.startGame(userId, roomId);
        return new ResponseEntity<>(problems, HttpStatus.OK);
    }
}