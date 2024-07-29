package com.scf.user.profile.domain.entity;

import com.scf.user.member.domain.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.sql.Timestamp;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "record")
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recordId;

    @Column(name = "time", nullable = false)
    private Timestamp time;

    @Column(name = "rank", nullable = false)
    private int rank;

    @Column(name = "score", nullable = false)
    private int score;

    @Column(name = "part_cnt", nullable = false)
    private int partCnt;

    @Column(name = "game_type", nullable = false)
    private int gameType;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Member member;


}
