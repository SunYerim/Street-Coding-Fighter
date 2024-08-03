package com.scf.multi.application;

import com.scf.multi.domain.dto.problem.Problem;
import com.scf.multi.domain.dto.problem.ProblemAnswer;
import com.scf.multi.domain.dto.problem.ProblemChoice;
import com.scf.multi.domain.dto.problem.ProblemContent;
import com.scf.multi.domain.dto.problem.ProblemType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ProblemService {

    private final WebClient webClient;

    public ProblemService(WebClient.Builder webClientBuilder,
        @Value("${problem.server.url}") String problemServerUrl) {
        this.webClient = webClientBuilder.baseUrl(problemServerUrl).build();
    }

    public List<Problem> getProblems(Integer playRound) {

        List<ProblemChoice> problemChoices = Arrays.asList(
            ProblemChoice.builder().problemId(1L).choiceId(1).choiceText("i+1").build(),
            ProblemChoice.builder().problemId(1L).choiceId(2).choiceText("i+2").build(),
            ProblemChoice.builder().problemId(1L).choiceId(3).choiceText("i+3").build()
        );

        List<ProblemAnswer> ProblemAnswers = Arrays.asList(
            ProblemAnswer.builder().answerId(1).problemId(1L).blankPosition(1).correctChoice(problemChoices.get(0)).correctAnswerText(null).build(),
            ProblemAnswer.builder().answerId(2).problemId(1L).blankPosition(2).correctChoice(problemChoices.get(1)).correctAnswerText(null).build(),
            ProblemAnswer.builder().answerId(3).problemId(1L).blankPosition(3).correctChoice(problemChoices.get(2)).correctAnswerText(null).build()
        );

        Problem problem1 = Problem // 빈칸 채우기
            .builder()
            .problemId(1L)
            .problemType(ProblemType.FILL_IN_THE_BLANK)
            .category("정렬")
            .title("버블 정렬")
            .problemContent(ProblemContent.builder()
                .content("빈칸을 채우세요.")
                .numberOfBlank(3)
                .problemId(1L)
                .build()
            )
            .problemChoices(problemChoices)
            .problemAnswers(ProblemAnswers)
            .build();

        Problem problem2 = Problem // 주관식
            .builder()
            .problemId(2L)
            .problemType(ProblemType.SHORT_ANSWER_QUESTION)
            .category("정렬")
            .title("삽입 정렬")
            .problemContent(ProblemContent.builder()
                .content("답을 쓰세요.")
                .numberOfBlank(0)
                .problemId(2L)
                .build()
            )
            .problemChoices(null)
            .problemAnswers(List.of(ProblemAnswer.builder().answerId(2).problemId(2L).blankPosition(null).correctChoice(null).correctAnswerText("test answer").build()))
            .build();

        Problem problem3 = Problem // 주관식
            .builder()
            .problemId(3L)
            .problemType(ProblemType.SHORT_ANSWER_QUESTION)
            .category("정렬")
            .title("삽입 정렬")
            .problemContent(ProblemContent.builder()
                .content("답을 쓰세요.")
                .numberOfBlank(0)
                .problemId(2L)
                .build()
            )
            .problemChoices(null)
            .problemAnswers(List.of(ProblemAnswer.builder().answerId(2).problemId(3L).blankPosition(null).correctChoice(null).correctAnswerText("test answer").build()))
            .build();

        Problem problem4 = Problem // 주관식
            .builder()
            .problemId(4L)
            .problemType(ProblemType.SHORT_ANSWER_QUESTION)
            .category("정렬")
            .title("삽입 정렬")
            .problemContent(ProblemContent.builder()
                .content("답을 쓰세요.")
                .numberOfBlank(0)
                .problemId(2L)
                .build()
            )
            .problemChoices(null)
            .problemAnswers(List.of(ProblemAnswer.builder().answerId(2).problemId(4L).blankPosition(null).correctChoice(null).correctAnswerText("test answer").build()))
            .build();

        Problem problem5 = Problem // 주관식
            .builder()
            .problemId(5L)
            .problemType(ProblemType.SHORT_ANSWER_QUESTION)
            .category("정렬")
            .title("삽입 정렬")
            .problemContent(ProblemContent.builder()
                .content("답을 쓰세요.")
                .numberOfBlank(0)
                .problemId(2L)
                .build()
            )
            .problemChoices(null)
            .problemAnswers(List.of(ProblemAnswer.builder().answerId(2).problemId(5L).blankPosition(null).correctChoice(null).correctAnswerText("test answer").build()))
            .build();


        return List.of(problem1, problem2, problem3, problem4, problem5);

//        return webClient.get()
//            .uri("?limit=" + playRound)
//            .retrieve()
//            .bodyToFlux(Problem.class)
//            .collectList()
//            .block();
    }
}
