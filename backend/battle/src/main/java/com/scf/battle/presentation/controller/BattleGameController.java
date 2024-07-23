package com.scf.battle.presentation.controller;

import com.scf.battle.application.BattleGameService;
import com.scf.battle.domain.dto.JoinRoomDto;
import com.scf.battle.domain.model.BattleGameRoom;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public ResponseEntity<?> findRoom() {
        BattleGameRoom battleGameRoom = battleGameService.findById();
        return new ResponseEntity<>(battleGameRoom, HttpStatus.OK);
    }

    @PostMapping("/room/{roomId}")
    public ResponseEntity<?> joinRoom(PathVariable roomId, @RequestBody JoinRoomDto joinRoomDto) {
        battleGameService.joinRoom(roomId, joinRoomDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @
}