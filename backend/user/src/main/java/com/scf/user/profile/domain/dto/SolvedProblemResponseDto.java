package com.scf.user.profile.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
public class SolvedProblemResponseDto {

    private int solvedId; // 푼 문제 아이디(user)
    private boolean isCorrect; // 정답 여부 -> 푼 문제(user)
    private String choice; // 선택한 값 -> 푼 문제(user)
    private String title; // 문제 정보 -> 문제 제목(problem server)
    private ProblemType type; // enum타입으로 수정, 문제 정보 -> 문제 유형(problem server)
    private String category; // 문제 정보 -> 카테고리(problem server)
    private int difficulty; // 문제 정보 -> 난이도(problem server)

}
