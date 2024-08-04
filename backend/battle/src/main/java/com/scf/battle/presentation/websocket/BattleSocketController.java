package com.scf.battle.presentation.websocket;

import com.scf.battle.application.BattleGameService;
import com.scf.battle.domain.dto.Problem.ProblemResponse;
import com.scf.battle.domain.dto.Room.JoinRoomUserDTO;
import com.scf.battle.domain.dto.Room.ResultRoomDTO;
import com.scf.battle.domain.dto.User.FightDTO;
import com.scf.battle.domain.dto.Room.JoinRoomDTO;
import com.scf.battle.domain.dto.Room.GameResultRoomDTO;
import com.scf.battle.domain.dto.User.Player;
import com.scf.battle.domain.dto.User.Solved;
import com.scf.battle.domain.enums.GameResultType;
import com.scf.battle.domain.enums.GameType;
import com.scf.battle.domain.model.BattleGameRoom;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.scf.battle.infrastructure.KafkaMessageProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@Controller
@RequiredArgsConstructor
public class BattleSocketController {

    private final BattleGameService battleGameService;
    private final SimpMessagingTemplate messagingTemplate;
    private final KafkaMessageProducer kafkaMessageProducer;

    @MessageMapping("/game/{roomId}/join")
    public void joinRoom(@DestinationVariable String roomId, JoinRoomDTO joinRoomDTO) {
        System.out.println(joinRoomDTO);
        battleGameService.joinRoom(roomId, joinRoomDTO.getUserId(), joinRoomDTO.getUsername(), joinRoomDTO.getRoomPassword());
        //BattleGameRoom room = battleGameService.findById(roomId); // 필요 없지만, 디버깅시 필요할 수 있음.

        messagingTemplate.convertAndSend("/room/" + roomId, new JoinRoomUserDTO(joinRoomDTO.getUserId(), joinRoomDTO.getUsername())); // 실제로는 입장 메세지
    }
    @SendTo("/topic/messages")
    @MessageMapping("/quiz/answer")
    public void handleQuizAnswer(Solved solved) {
        System.out.println("sasa"+solved.toString());
        FightDTO fightDTO = battleGameService.markSolution(solved.getRoomId(), solved.getUserId(),
            solved);
        System.out.println("Received payload: " + solved.toString());
        System.out.println("fightDTO: " + fightDTO.toString());
        messagingTemplate.convertAndSend("/topic/messages/" + solved.getRoomId(), fightDTO);

        // 만약 isAttack이 true이고, 나머지 플레이어
        if(battleGameService.isRoundOver(solved.getRoomId())){ // 라운드가 끝났다면
            Integer currentRound = battleGameService.runRound(solved.getRoomId());
            List<Problem> currentRoundProblem  = battleGameService.getCurrentRoundProblem(solved.getRoomId(),currentRound);
            messagingTemplate.convertAndSend("/topic/messages/" + currentRoundProblem);
        }

//        if (room.getPlayerA().getHp() <= 0 || room.getPlayerB().getHp() <= 0
//            || room.getRound() > 10) {
//            String resultMessage = determineWinner(room);
//            messagingTemplate.convertAndSend("/topic/messages/" + solved.getRoomId(), resultMessage);
//        }
    }

    private String determineWinner(BattleGameRoom room) {
        int playerAHp = room.getPlayerA().getHp();
        int playerBHp = room.getPlayerB().getHp();

        if (playerAHp > playerBHp) {
            return "Player A Wins!";
        } else if (playerBHp > playerAHp) {
            return "Player B Wins!";
        } else {
            return "It's a Tie!";
        }
    }
}
