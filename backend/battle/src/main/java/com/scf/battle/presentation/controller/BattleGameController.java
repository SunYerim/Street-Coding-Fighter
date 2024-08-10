package com.scf.battle.presentation.controller;

import com.scf.battle.application.BattleSocketService;
import com.scf.battle.application.GameService;
import com.scf.battle.application.RoomService;
import com.scf.battle.domain.dto.Room.CreateRoomDTO;
import com.scf.battle.domain.dto.Room.JoinRoomResponseDTO;
import com.scf.battle.domain.dto.Room.JoinRoomRequestDTO;
import com.scf.battle.domain.dto.Room.RoomResponseDTO;
import com.scf.battle.domain.model.BattleGameRoom;
import com.scf.battle.global.error.exception.BusinessException;
import jakarta.validation.Valid;
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

    private final RoomService roomService;
    private final GameService gameService;
    private final BattleSocketService battleSocketService;

    @GetMapping("/room")
    public ResponseEntity<List<RoomResponseDTO>> roomList() {
        List<BattleGameRoom> rooms = roomService.findAllRooms();
        if (rooms.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        List<RoomResponseDTO> roomResponseDTOS = roomService.convertToRoomResponseDTOs(rooms);
        return ResponseEntity.ok(roomResponseDTOS); // 200 OK
    }



    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> findRoom(@PathVariable String roomId) { // room 하나만 return
        BattleGameRoom room = roomService.findById(roomId);
        return new ResponseEntity<>(room, HttpStatus.OK);
    }

    @PostMapping("/room/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId,
                                      @RequestHeader Long memberId, @RequestHeader String username,
                                      @RequestBody JoinRoomRequestDTO joinRoomRequestDTO) {
        try {
            String password = joinRoomRequestDTO.getPassword();
            roomService.joinRoom(roomId, memberId, username, password);
            BattleGameRoom room = roomService.findById(roomId);
            return new ResponseEntity<>(new JoinRoomResponseDTO(room.getPlayerA().getUsername(), room.getPlayerA().getUserId(), room.getHostCharacterType()), HttpStatus.OK);
        } catch (BusinessException e) {
            return new ResponseEntity<>(e.getMessage(), e.getHttpStatus());
        }
    }

    @PostMapping("/room")
    public ResponseEntity<?> createRoom(@RequestHeader Long memberId, @RequestHeader String username,
                                        @Valid @RequestBody CreateRoomDTO createRoomDto) {
        try {
            String roomId = roomService.createRoom(memberId, username, createRoomDto);
            return new ResponseEntity<>(roomId, HttpStatus.OK);
        } catch (BusinessException e) {
            return new ResponseEntity<>(e.getMessage(), e.getHttpStatus());
        }
    }

    @PostMapping("/room/{roomId}/start")
    public ResponseEntity<?> gameStart(@RequestHeader Long memberId, @PathVariable String roomId) {
        try {
            gameService.startGame(memberId, roomId);
            battleSocketService.sendRoundProblemToRoom(roomId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (BusinessException e) {
            return new ResponseEntity<>(e.getMessage(), e.getHttpStatus());
        }
    }

    @PostMapping("/room/{roomId}/leave")
    public ResponseEntity<?> leaveRoom(@RequestHeader Long memberId, @PathVariable String roomId) {
        try {
            battleSocketService.leaveRoom(memberId, roomId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (BusinessException e) {
            return new ResponseEntity<>(e.getMessage(), e.getHttpStatus());
        }
    }
}