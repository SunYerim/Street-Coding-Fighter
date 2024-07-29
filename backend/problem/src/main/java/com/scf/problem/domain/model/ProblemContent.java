package com.scf.problem.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProblemContent {

    @Builder
    public ProblemContent(String content, Integer numberOfBlanks, ProblemInfo problemInfo) {
        this.content = content;
        this.numberOfBlanks = numberOfBlanks;
        this.problemInfo = problemInfo;
    }

    @Id
    private Long problemId;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer numberOfBlanks;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "problem_id")
    private ProblemInfo problemInfo;
}
