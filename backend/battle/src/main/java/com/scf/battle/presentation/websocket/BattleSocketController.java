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
                determineWinner(room);
                return;
            }
            // 큰 경우 예외처리
            if (room.getPlayerA().getHp() <= 0 || room.getPlayerB().getHp() <= 0) {
                determineWinner(room);
                return;
            }
            battleGameService.sendRoundProblemToRoom(roomId); // 다시 초기 3문제 주기
            //현재 라운드 보내기
        }
    }

    @MessageMapping("/game/{roomId}/selectProblem")
    public void handleSelectProblem(@DestinationVariable String roomId, @RequestBody Map<String, Long> payload, @RequestHeader Long memberId) {
        Long selectProblemId = payload.get("problemId"); // "problemId" : 1L
        BattleGameRoom room = battleGameService.findById(roomId);
        System.out.println(roomId + " " + selectProblemId + " " + memberId);
        Player selectingUser = room.getPlayerById(memberId);
        Player opponentUser = room.getOpponentById(memberId);
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

    private void determineWinner(BattleGameRoom room) {

        int playerAHp = room.getPlayerA().getHp();
        int playerBHp = room.getPlayerB().getHp();

        Long winnerId = null;
        Long loserId = null;
        GameResultType determineValue = GameResultType.DRAW;
        if (playerAHp > playerBHp) {
            determineValue = GameResultType.PLAYER_A_WINS;
            winnerId = room.getPlayerA().getUserId();
            loserId = room.getPlayerB().getUserId();
        } else if (playerBHp > playerAHp) {
            determineValue = GameResultType.PLAYER_B_WINS;
            winnerId = room.getPlayerB().getUserId();
            loserId = room.getPlayerA().getUserId();
        } // 무승부는 null 값

        Map<String, Long> result = Map.of(
                "winner", winnerId != null ? winnerId : -1,
                "loser", loserId != null ? loserId : -1
        );
        sendToKafkaSolved(room); // kafka에게 유저별 문제 풀이 보내기
        sendToKafkaGameResult(room, determineValue); // kafka에게 게임 결과 보내기
        // 게임이 끝났으므로 클라이언트에게 알림
        messagingTemplate.convertAndSend("/room/" + room.getRoomId(), new ResultRoomDTO(result));

        // BattleGameRoom 삭제
        battleGameService.removeRoom(room.getRoomId());
    }

    private void sendToKafkaSolved(BattleGameRoom room) {
        List<Player> players = Arrays.asList(room.getPlayerA(), room.getPlayerB());

        players.forEach(player ->
                Optional.ofNullable(player)
                        .map(Player::getSolveds)
                        .ifPresent(kafkaMessageProducer::sendSolved)
        );
    }

    private void sendToKafkaGameResult(BattleGameRoom room, GameResultType determineValue) {
        GameResultRoomDTO gameResultRoomDTO = new GameResultRoomDTO(
                GameType.BATTLE,
                LocalDateTime.now(),
                room.getPlayerA().getUserId(),
                room.getPlayerB().getUserId(),
                determineValue
        );
        kafkaMessageProducer.sendGameResult(gameResultRoomDTO);
    }
}