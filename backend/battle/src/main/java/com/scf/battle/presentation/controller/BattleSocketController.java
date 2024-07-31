package com.scf.battle.presentation.controller;

import com.scf.battle.application.BattleGameService;
import com.scf.battle.domain.dto.FightDTO;
import com.scf.battle.domain.dto.JoinRoomDTO;
import com.scf.battle.domain.dto.Problem;
import com.scf.battle.domain.dto.Solved;
import com.scf.battle.domain.model.BattleGameRoom;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class BattleSocketController {

    private final BattleGameService battleGameService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/quiz/join")
    public void joinRoom(JoinRoomDTO joinRoomDTO) {
        System.out.println(joinRoomDTO);
        battleGameService.joinRoom(joinRoomDTO.getRoomId(), joinRoomDTO.getUserId(),
            joinRoomDTO.getUsername(), joinRoomDTO.getRoomPassword());
        BattleGameRoom room = battleGameService.findById(joinRoomDTO.getRoomId());
        messagingTemplate.convertAndSend("/topic/quiz/" + joinRoomDTO.getRoomId(), room);
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
