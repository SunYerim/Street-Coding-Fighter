package com.scf.battle.application;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.scf.battle.domain.dto.Problem.*;
import com.scf.battle.domain.enums.ProblemType;
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

        return webClient.get()
                .uri("?limit=" + playRound)
                .retrieve()
                .bodyToFlux(Problem.class)
                .collectList()
                .block();
        // 예제 1: 객관식 문제 생성
//        List<Problem> problems = new ArrayList<>();
//        Problem multipleChoiceProblem = Problem.builder()
//                .problemId(1L)
//                .title("파이썬에서 변수를 선언할 때 올바른 방법은 무엇인가요?")
//                .problemType(ProblemType.MULTIPLE_CHOICE)
//                .category("programming")
//                .difficulty(1)
//                .problemContent(ProblemContent.builder()
//                        .problemId(1L)
//                        .content("파이썬에서 변수를 선언할 때 올바른 방법은 무엇인가요?")
//                        .numberOfBlank(0)
//                        .build())
//                .problemChoices(Arrays.asList(
//                        ProblemChoice.builder().choiceId(1).problemId(1L).choiceText("1st_variable = 10").build(),
//                        ProblemChoice.builder().choiceId(2).problemId(1L).choiceText("first variable = 10").build(),
//                        ProblemChoice.builder().choiceId(3).problemId(1L).choiceText("first_variable = 10").build(),
//                        ProblemChoice.builder().choiceId(4).problemId(1L).choiceText("first-variable = 10").build()
//                ))
//                .problemAnswers(Arrays.asList(
//                        ProblemAnswer.builder()
//                                .answerId(1)
//                                .problemId(1L)
//                                .blankPosition(null)
//                                .correctChoice(ProblemChoice.builder()
//                                        .choiceId(3)
//                                        .problemId(1L)
//                                        .choiceText("first_variable = 10")
//                                        .build())
//                                .correctAnswerText(null)
//                                .build()
//                ))
//                .build();
//
//        problems.add(multipleChoiceProblem);
//        problems.add(multipleChoiceProblem);
//        problems.add(multipleChoiceProblem);
//        problems.add(multipleChoiceProblem);
//        problems.add(multipleChoiceProblem);
//        problems.add(multipleChoiceProblem);
        // 예제 2: 주관식 문제 생성
//        Problem shortAnswerProblem = Problem.builder()
//                .problemId(3L)
//                .title("조건문 문제")
//                .problemType(ProblemType.SHORT_ANSWER_QUESTION)
//                .category("조건문")
//                .difficulty(1)
//                .problemContent(ProblemContent.builder()
//                        .problemId(3L)
//                        .content("다음 코드를 실행했을 때의 출력을 예상하시오.\\n\\n코드:\\n\\nif 10 % 3 == 1:\\n    print(\"True\")\\nelse:\\n    print(\"False\")")
//                        .numberOfBlank(0)
//                        .build())
//                .problemChoices(new ArrayList<>()) // 주관식 문제는 선택지가 없음
//                .problemAnswers(Arrays.asList(
//                        ProblemAnswer.builder()
//                                .answerId(5)
//                                .problemId(3L)
//                                .blankPosition(null)
//                                .correctChoice(ProblemChoice.builder()
//                                        .choiceId(null)
//                                        .problemId(3L)
//                                        .choiceText("True")
//                                        .build())
//                                .correctAnswerText("True")
//                                .build()
//                ))
//                .build();

        //problems.add(shortAnswerProblem);
        //problems.add(shortAnswerProblem);
        // 예제 3: 빈칸 채우기 문제 생성
//        Problem fillInTheBlankProblem = Problem.builder()
//                .problemId(2L)
//                .title("빈칸 문제 예시")
//                .problemType(ProblemType.FILL_IN_THE_BLANK)
//                .category("정렬")
//                .difficulty(1)
//                .problemContent(ProblemContent.builder()
//                        .problemId(2L)
//                        .content("def bubbleSort(array):\\n    len_array = len(array)\\n    for i in range(len_array):\\n        for j in range(0, len_array-i-1):\\n            if array[j] > array[$blank1$]:\\n                array[j], array[$blank2$] = array[$blank3$], array[j]")
//                        .numberOfBlank(3)
//                        .build())
//                .problemChoices(Arrays.asList(
//                        ProblemChoice.builder().choiceId(5).problemId(2L).choiceText("i").build(),
//                        ProblemChoice.builder().choiceId(6).problemId(2L).choiceText("j+1").build(),
//                        ProblemChoice.builder().choiceId(7).problemId(2L).choiceText("len_array").build(),
//                        ProblemChoice.builder().choiceId(8).problemId(2L).choiceText("i-1").build(),
//                        ProblemChoice.builder().choiceId(9).problemId(2L).choiceText("j-1").build(),
//                        ProblemChoice.builder().choiceId(10).problemId(2L).choiceText("j").build()
//                ))
//                .problemAnswers(Arrays.asList(
//                        ProblemAnswer.builder()
//                                .answerId(2)
//                                .problemId(2L)
//                                .blankPosition(1)
//                                .correctChoice(ProblemChoice.builder()
//                                        .choiceId(6)
//                                        .problemId(2L)
//                                        .choiceText("j+1")
//                                        .build())
//                                .correctAnswerText(null)
//                                .build(),
//                        ProblemAnswer.builder()
//                                .answerId(3)
//                                .problemId(2L)
//                                .blankPosition(2)
//                                .correctChoice(ProblemChoice.builder()
//                                        .choiceId(6)
//                                        .problemId(2L)
//                                        .choiceText("j+1")
//                                        .build())
//                                .correctAnswerText(null)
//                                .build(),
//                        ProblemAnswer.builder()
//                                .answerId(4)
//                                .problemId(2L)
//                                .blankPosition(3)
//                                .correctChoice(ProblemChoice.builder()
//                                        .choiceId(10)
//                                        .problemId(2L)
//                                        .choiceText("j")
//                                        .build())
//                                .correctAnswerText(null)
//                                .build()
//                ))
//                .build();

        //problems.add(fillInTheBlankProblem);
        //problems.add(fillInTheBlankProblem);
        //return problems;
    }

}
