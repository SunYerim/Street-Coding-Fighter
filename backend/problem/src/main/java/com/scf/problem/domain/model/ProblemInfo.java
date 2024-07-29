package com.scf.problem.domain.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.util.List;
import lombok.Getter;

@Entity
@Getter
public class ProblemInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer problemId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer type;

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

