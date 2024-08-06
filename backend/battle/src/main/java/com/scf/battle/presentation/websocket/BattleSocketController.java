package com.scf.battle.presentation.websocket;

import com.scf.battle.application.BattleGameService;
import com.scf.battle.application.KafkaService;
import com.scf.battle.domain.dto.Problem.ProblemResponse;
import com.scf.battle.domain.dto.Problem.ProblemSelectDTO;
import com.scf.battle.domain.dto.Room.JoinRoomSocketResponseDTO;
import com.scf.battle.domain.dto.Room.ResultRoomDTO;
import com.scf.battle.domain.dto.User.FightDTO;
import com.scf.battle.domain.dto.Room.JoinRoomRequestDTO;
import com.scf.battle.domain.dto.User.Player;
import com.scf.battle.domain.dto.User.Solved;
import com.scf.battle.domain.enums.GameResultType;
import com.scf.battle.domain.model.BattleGameRoom;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
@Controller
@RequiredArgsConstructor
public class BattleSocketController {

    private final BattleGameService battleGameService;
    private final SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/game/{roomId}/join")
    public void joinRoom(@DestinationVariable String roomId, JoinRoomRequestDTO joinRoomRequestDTO) {
        System.out.println(joinRoomRequestDTO);
        battleGameService.joinRoom(roomId, joinRoomRequestDTO.getUserId(), joinRoomRequestDTO.getUsername(), joinRoomRequestDTO.getRoomPassword());
        //BattleGameRoom room = battleGameService.findById(roomId); // 필요 없지만, 디버깅시 필요할 수 있음.

        messagingTemplate.convertAndSend("/room/" + roomId, new JoinRoomSocketResponseDTO(
            joinRoomRequestDTO.getUserId(), joinRoomRequestDTO.getUsername())); // 실제로는 입장 메세지
    }

    @MessageMapping("/game/{roomId}/answer")
    public void handleQuizAnswer(@DestinationVariable String roomId, Solved solved) {
        BattleGameRoom room = battleGameService.findById(roomId);
        System.out.println("Received payload: " + solved.toString());
        FightDTO fightDTO = battleGameService.markSolution(roomId, solved.getUserId(), solved);
        System.out.println("fightDTO: " + fightDTO.toString());
        messagingTemplate.convertAndSend("/room/" + roomId, fightDTO); // 서버에서 프론트로 메세지 보내기
        Long curruntUserId = solved.getUserId();
        if (room.getPlayerA().getUserId().equals(curruntUserId)) room.getPlayerA().addSolved(solved);
        if (room.getPlayerB().getUserId().equals(curruntUserId)) room.getPlayerB().addSolved(solved);

        if (battleGameService.isRoundOver(roomId)) { // 라운드가 끝났다면
            if (room.getCurrentRound().equals(room.getFinalRound())) {
                battleGameService.determineWinner(room);
                return;
            }
            // 큰 경우 예외처리
            if (room.getPlayerA().getHp() <= 0 || room.getPlayerB().getHp() <= 0) {
                battleGameService.determineWinner(room);
                return;
            }
            battleGameService.sendRoundProblemToRoom(roomId); // 다시 초기 3문제 주기
            //현재 라운드 보내기
        }
    }

    @MessageMapping("/game/{roomId}/selectProblem")
    public void handleSelectProblem(@DestinationVariable String roomId, ProblemSelectDTO problemSelectDTO) {
        Long selectProblemId = problemSelectDTO.getProblemId(); // "problemId" : 1L
        BattleGameRoom room = battleGameService.findById(roomId);
        System.out.println("handleSelectProblem : " +roomId + " " + selectProblemId + " " + problemSelectDTO.getMemberId());
        Player selectingUser = room.getPlayerById(problemSelectDTO.getMemberId());
        Player opponentUser = room.getOpponentById(problemSelectDTO.getMemberId());
        List<ProblemResponse.SelectProblemDTO> roundSelectProblems = room.getProblemsForRound(room.getCurrentRound())
                .stream()
                .map(problem -> ProblemResponse.SelectProblemDTO.builder()
                        .problemId(problem.getProblemId())
                        .title(problem.getTitle())
                        .problemType(problem.getProblemType())
                        .category(problem.getCategory())
                        .difficulty(problem.getDifficulty())
                        .problemContent(problem.getProblemContent())
                        .problemChoices(problem.getProblemChoices())
                        .build())
                .toList();
        Optional<ProblemResponse.SelectProblemDTO> selectedProblem = roundSelectProblems.stream()
                .filter(problem -> problem.getProblemId().equals(selectProblemId))
                .findFirst();
        selectedProblem.ifPresent(problem -> {
            if (selectingUser.getUserId().equals(room.getPlayerA().getUserId())) {
                room.setProblemForPlayerB(problem);
            } else {
                room.setProblemForPlayerA(problem);
            }
        });

        // 상대방에게 선택된 문제 전송
        messagingTemplate.convertAndSend("/room/" + roomId + "/" + opponentUser.getUserId(), selectedProblem);

    }
}