package com.scf.problem.domain.model;

import com.scf.problem.constant.ProblemType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProblemInfo {

    @Builder
    public ProblemInfo(String title, ProblemType problemType, String category, Integer difficulty,
        ProblemContent problemContent, List<ProblemChoice> problemChoices, List<ProblemAnswer> problemAnswers) {
        this.title = title;
        this.problemType = problemType;
        this.category = category;
        this.difficulty = difficulty;
        this.problemContent = problemContent;
        this.problemChoices = problemChoices;
        this.problemAnswers = problemAnswers;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long problemId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProblemType problemType;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Integer difficulty;

    @OneToOne(mappedBy = "problemInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ProblemContent problemContent;

    @OneToMany(mappedBy = "problemInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProblemChoice> problemChoices;

    @OneToMany(mappedBy = "problemInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProblemAnswer> problemAnswers;
}

