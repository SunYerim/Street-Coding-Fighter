package com.scf.user.profile.application.service;

import com.scf.user.member.domain.entity.Member;
import com.scf.user.member.domain.repository.UserRepository;
import com.scf.user.profile.application.client.ProblemClient;
import com.scf.user.profile.domain.dto.ChoiceTextConverter;
import com.scf.user.profile.domain.dto.DjangoResponseDto;
import com.scf.user.profile.domain.dto.HistoryListResponseDto;
import com.scf.user.profile.domain.dto.HistoryResponseDto;
import com.scf.user.profile.domain.dto.ProblemResponseDto;
import com.scf.user.profile.domain.dto.ProblemType;
import com.scf.user.profile.domain.dto.ProfileResponseDto;
import com.scf.user.profile.domain.dto.kafka.SolvedProblemKafkaRequestDto;
import com.scf.user.profile.domain.dto.SolvedProblemResponseDto;
import com.scf.user.profile.domain.dto.SolvedProblemsListDto;
import com.scf.user.profile.domain.entity.Character;
import com.scf.user.profile.domain.entity.Record;
import com.scf.user.profile.domain.entity.Solved;
import com.scf.user.profile.domain.repository.SolvedRepository;
import com.scf.user.profile.global.exception.ProblemNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final SolvedRepository solvedRepository;
    private final ProblemClient problemClient;

    // 프로필 정보 조회
    @Override
    public ProfileResponseDto getProfileInfo(Long memberId) {
        // 멤버 정보 조회
        Member member = userRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Character character = member.getCharacter();

        // characterType * 100 + characterCloth 값을 계산
        int characterValue = character.getCharacterType() * 100 + character.getCharacterCloth();

        // 프로필 DTO 생성
        return ProfileResponseDto.builder()
                .name(member.getName())
                .birth(member.getBirth())
                .exp(character.getExp())
                .character(characterValue) // 계산된 값 설정
                .school(member.getSchoolName())
                .build();
    }

    // 전체 전적 조회
    @Override
    public HistoryListResponseDto getHistoryList(String memberId) {
        // 멤버 정보 조회
        Member member = userRepository.findById(Long.parseLong(memberId))
            .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 회원이 가지고 있는 게임 결과기록들 중 상위 10개만 listDTO에 담아서 return시킨다.
        List<HistoryResponseDto> historyList = member.getRecords().stream()
            .sorted((r1, r2) -> Integer.compare(r2.getScore(), r1.getScore())) // 우선 점수로 정렬
            .limit(10) // 상위 10개
            .map(record -> HistoryResponseDto.from(
                record.getTime().toLocalDateTime(), // Record의 시간 필드를 LocalDateTime으로 변환
                record.getRanking(),
                record.getScore(),
                record.getGameType(),
                record.getPartCnt()))
            .collect(Collectors.toList());
        return new HistoryListResponseDto(historyList);
    }

    // 푼 문제 리스트 조회
    // 이때, 문제 정보가 필요하므로 문제 서버에서 데이터를 받아서 dto에 넣어준다.
    @Override
    public SolvedProblemsListDto getSolvedProblemsList(String memberId) {
        // 멤버 정보 조회
        Member member = userRepository.findById(Long.parseLong(memberId))
            .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 유저가 푼 문제 리스트를 가져옴
        List<Solved> solvedProblems = member.getSolvedProblems();

        // 문제 정보를 가져오고 DTO로 변환
        List<SolvedProblemResponseDto> solvedProblemResponses = solvedProblems.stream()
            .map(solvedProblem -> {
                // 문제 서버에서 문제 정보를 가져옴
                ProblemResponseDto problemInfo = problemClient.getProblemById(
                        (long) solvedProblem.getProblemId())
                    .block(); // Mono를 동기식으로 처리

                if (problemInfo != null) {
                    return SolvedProblemResponseDto.builder()
                        .solvedId(solvedProblem.getSolvedId())
                        .isCorrect(solvedProblem.isCorrect())
                        .choice(solvedProblem.getChoice())
                        .title(problemInfo.getTitle())
                        .type(problemInfo.getProblemType())
                        .category(problemInfo.getCategory())
                        .difficulty(problemInfo.getDifficulty())
                        .problemContent(problemInfo.getProblemContent())
                        .problemChoices(problemInfo.getProblemChoices())
                        .problemAnswers(problemInfo.getProblemAnswers())
                        .build();
                } else {
                    // 문제 정보를 가져오지 못했을 때 예외 발생
                    throw new ProblemNotFoundException(
                        "문제 정보를 가져올 수 없습니다. 문제 ID: " + solvedProblem.getProblemId());
                }
            })
            .collect(Collectors.toList());

        return new SolvedProblemsListDto(solvedProblemResponses);
    }

    // django 보고서 데이터 요청
    @Override
    public DjangoResponseDto getDjangoInfo(String memberId) {
        // 멤버 정보 조회
        Member member = userRepository.findById(Long.parseLong(memberId))
            .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 멤버가 푼 문제들 리스트를 가져오기
        SolvedProblemsListDto solvedList = getSolvedProblemsList(memberId);

        // 멤버의 게임 기록에서 등수 정보 가져오기
        List<Record> records = member.getRecords();

        // 평균 랭킹 계산
        int totalRank = records.stream()
            .mapToInt(Record::getRanking)
            .sum();
        int averageRank = records.isEmpty() ? 0 : totalRank / records.size();

        // solvedProblemDto 리스트 생성
        List<DjangoResponseDto.solvedProblemDto> solvedProblemDtoList = solvedList.getSolvedList()
            .stream()
            .map(solved -> DjangoResponseDto.solvedProblemDto.builder()
                .isCorrect(solved.isCorrect())
                .category(solved.getCategory())
                .difficulty(solved.getDifficulty())
                .build())
            .collect(Collectors.toList());

        // DjangoResponseDto 빌드하여 반환
        return DjangoResponseDto.builder()
            .averageRank(averageRank)
            .solvedCount(solvedProblemDtoList.size())
            .list(solvedProblemDtoList)
            .build();

    }

    // 경험치 업데이트
    @Override
    public void updateExp(Long memberId, int newExp) {
        // 멤버 정보 조회
        Member member = userRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 새로운 경험치로 업데이트
        member.getCharacter().setExp(newExp);

        // 변경사항을 저장
        userRepository.save(member);

        System.out.println("경험치가 업데이트 되었습니다. " + memberId + ": " + newExp);
    }

    @Override
    @Transactional
    public void submitSolved(Long memberId, SolvedProblemKafkaRequestDto problemRequestDto) {
        // 멤버 정보를 조회
        Member member = userRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 문제 아이디로 문제 조회해서 type 추출
        // 문제 정보
        ProblemResponseDto problemInfo = problemClient.getProblemById(
                problemRequestDto.getProblemId())
            .block(); // Mono를 동기식으로 처리

        // 문제의 type
        ProblemType problemType = problemInfo.getProblemType();

        String convertedChoiceText = null;

        // 문제의 타입에 따라서 세분화.
        // 단답식일 경우
        if (problemType.equals(ProblemType.SHORT_ANSWER_QUESTION)) {
            convertedChoiceText = ChoiceTextConverter.ShortAnswer(problemRequestDto.getChoice());
        }
        // 빈칸일 경우
        if (problemType.equals(ProblemType.FILL_IN_THE_BLANK)) {
            convertedChoiceText = ChoiceTextConverter.FillInBlank(
                problemRequestDto.getChoiceText());
        }
        // 객관식인 경우
        if (problemType.equals(ProblemType.MULTIPLE_CHOICE)) {
            convertedChoiceText = ChoiceTextConverter.MultipleChoice(
                problemRequestDto.getChoiceText());
        }

        //Solved 엔티티 생성
        Solved solved = new Solved();
        solved.setChoice(convertedChoiceText);
        solved.setCorrect(problemRequestDto.isCorrect());
        solved.setProblemId(
            problemRequestDto.getProblemId());
        solved.setMember(member);

        // Solved 엔티티 저장
        solvedRepository.save(solved);

    }

}
