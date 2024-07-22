package com.scf.user.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "characters")
public class Character {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "character_id")
    private int characterId;

    @Column(name = "exp")
    private int exp;

    @Column(name = "character_type")
    private int characterType;

    @OneToOne
    @JoinColumn(name = "member_id", referencedColumnName = "member_id", nullable = false) // FK 설정
    private User user;

}
