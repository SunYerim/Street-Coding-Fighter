package com.scf.problem.application;

import com.scf.problem.domain.dto.ProblemAnswerDTO;
import com.scf.problem.domain.dto.ProblemChoiceDTO;
import com.scf.problem.domain.dto.ProblemContentDTO;
import com.scf.problem.domain.dto.ProblemInfoDTO;
import com.scf.problem.domain.model.ProblemAnswer;
import com.scf.problem.domain.model.ProblemChoice;
import com.scf.problem.domain.model.ProblemContent;
import com.scf.problem.domain.model.ProblemInfo;
import com.scf.problem.domain.repository.ProblemInfoRepository;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemService {

    private final ProblemInfoRepository problemInfoRepository;

    public ProblemInfoDTO findOneByProblemId(Long problemId) {

        ProblemInfo problem = problemInfoRepository.findByProblemId(problemId);

        return convertToDTO(problem);
    }

    public List<ProblemInfoDTO> getRandomProblems(int limit) {
        List<ProblemInfo> problems = problemInfoRepository.findAll();
        Collections.shuffle(problems);

        return problems.stream()
            .limit(limit)
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private ProblemInfoDTO convertToDTO(ProblemInfo problem) {

        ProblemContentDTO contentDTO = mapToProblemContentDTO(problem.getProblemContent());
        List<ProblemChoiceDTO> choiceDTOs = mapToProblemChoiceDTOs(problem.getProblemChoices());
        List<ProblemAnswerDTO> answerDTOs = mapToProblemAnswerDTOs(problem.getProblemAnswers());

        return ProblemInfoDTO.builder()
            .problemId(problem.getProblemId())
            .title(problem.getTitle())
            .type(problem.getType())
            .category(problem.getCategory())
            .difficulty(problem.getDifficulty())
            .problemContent(contentDTO)
            .problemChoices(choiceDTOs)
            .problemAnswers(answerDTOs)
            .build();
    }

    private ProblemContentDTO mapToProblemContentDTO(ProblemContent content) {

        return ProblemContentDTO.builder()
            .problemId(content.getProblemId())
            .content(content.getContent())
            .numberOfBlanks(content.getNumberOfBlanks())
            .build();
    }

    private List<ProblemChoiceDTO> mapToProblemChoiceDTOs(List<ProblemChoice> choices) {

        return choices.stream()
            .map(choice -> ProblemChoiceDTO.builder()
                .choiceId(choice.getChoiceId())
                .problemId(choice.getProblemInfo().getProblemId())
                .choiceText(choice.getChoiceText())
                .build())
            .collect(Collectors.toList());
    }

    private List<ProblemAnswerDTO> mapToProblemAnswerDTOs(List<ProblemAnswer> answers) {

        return answers.stream()
            .map(this::mapToProblemAnswerDTO)
            .collect(Collectors.toList());
    }

    private ProblemAnswerDTO mapToProblemAnswerDTO(ProblemAnswer answer) {

        ProblemChoiceDTO correctChoiceDTO = ProblemChoiceDTO.builder()
            .choiceId(answer.getCorrectChoice().getChoiceId())
            .problemId(answer.getCorrectChoice().getProblemInfo().getProblemId())
            .choiceText(answer.getCorrectChoice().getChoiceText())
            .build();

        return ProblemAnswerDTO.builder()
            .answerId(answer.getAnswerId())
            .problemId(answer.getProblemInfo().getProblemId())
            .blankPosition(answer.getBlankPosition())
            .correctChoice(correctChoiceDTO)
            .correctAnswerText(answer.getCorrectAnswerText())
            .build();
    }
}
