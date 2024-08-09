package com.scf.battle.presentation.websocket;

import com.scf.battle.application.BattleSocketService;
import com.scf.battle.application.GameService;
import com.scf.battle.application.RoomService;
import com.scf.battle.application.UserService;
import com.scf.battle.domain.dto.Problem.ProblemRequestDTO;
import com.scf.battle.domain.dto.Problem.ProblemResponseDTO;
import com.scf.battle.domain.dto.Problem.ProblemSelectRequestDTO;
import com.scf.battle.domain.dto.Room.JoinRoomSocketResponseDTO;
import com.scf.battle.domain.dto.User.FightDTO;
import com.scf.battle.domain.dto.Room.JoinRoomSocketRequestDTO;
import com.scf.battle.domain.dto.User.Player;
import com.scf.battle.domain.dto.User.Solved;
import com.scf.battle.domain.model.BattleGameRoom;

import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
@Controller
@RequiredArgsConstructor
public class BattleSocketController {

    private final RoomService roomService;
    private final GameService gameService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    private final BattleSocketService battleSocketService;

    @MessageMapping("/game/{roomId}/join")
    public void joinRoom(@DestinationVariable String roomId, JoinRoomSocketRequestDTO joinRoomSocketRequestDTO) {
        roomService.joinRoom(roomId, joinRoomSocketRequestDTO.getUserId(), joinRoomSocketRequestDTO.getUsername(), joinRoomSocketRequestDTO.getRoomPassword());
        Integer guestCharacterType = userService.getCharacterType(joinRoomSocketRequestDTO.getUserId()).getCharacterType();
        messagingTemplate.convertAndSend("/room/" + roomId, new JoinRoomSocketResponseDTO(
            joinRoomSocketRequestDTO.getUserId(), joinRoomSocketRequestDTO.getUsername(), guestCharacterType)); // 실제로는 입장 메세지
    }

    @MessageMapping("/game/{roomId}/answer")
    public void handleQuizAnswer(@DestinationVariable String roomId, ProblemRequestDTO problemRequestDTO) {
        BattleGameRoom room = roomService.findById(roomId);


        FightDTO fightDTO = gameService.markSolution(roomId, problemRequestDTO.getUserId(), problemRequestDTO);

        messagingTemplate.convertAndSend("/room/" + roomId, fightDTO);

        if (gameService.isRoundOver(roomId)) {
            battleSocketService.handleRoundOver(room);
        }
    }

    @MessageMapping("/game/{roomId}/selectProblem")
    public void handleSelectProblem(@DestinationVariable String roomId, ProblemSelectRequestDTO problemSelectRequestDTO) {
        Long selectProblemId = problemSelectRequestDTO.getProblemId();
        BattleGameRoom room = roomService.findById(roomId);

        Player selectingUser = room.getPlayerById(problemSelectRequestDTO.getMemberId());
        Player opponentUser = room.getOpponentById(problemSelectRequestDTO.getMemberId());

        List<ProblemResponseDTO.SelectProblemDTO> roundSelectProblems = battleSocketService.getRoundSelectProblems(room);

        Optional<ProblemResponseDTO.SelectProblemDTO> selectedProblem = battleSocketService.findSelectedProblem(roundSelectProblems, selectProblemId);

        selectedProblem.ifPresent(problem -> {
            battleSocketService.assignProblemToOpponent(room, selectingUser, problem);
            problem.setItemBasedOnDifficulty(); // 아이템 설정 메서드 호출
        });
        messagingTemplate.convertAndSend("/room/" + roomId + "/" + opponentUser.getUserId(), selectedProblem);
    }



}