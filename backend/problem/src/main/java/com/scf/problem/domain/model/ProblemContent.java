package com.scf.problem.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.Getter;

@Entity
@Getter
public class ProblemContent {

    @Id
    private Integer problemId;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer numberOfBlanks;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "problem_id")
    private ProblemInfo problemInfo;
}
