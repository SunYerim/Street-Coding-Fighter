package com.scf.user.member.application.service;

import com.scf.user.member.domain.dto.charater.CharacterType;
import com.scf.user.member.domain.dto.charater.ClothingType;
import com.scf.user.member.domain.enums.Rarity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class GachaService {

    private static final List<ClothingType> clothingTypes = new ArrayList<>();
    private static final List<CharacterType> characterTypes = new ArrayList<>();

    static {
        clothingTypes.add(new ClothingType(1, 0.078, Rarity.COMMON));
        clothingTypes.add(new ClothingType(2, 0.025, Rarity.LEGENDARY));
        clothingTypes.add(new ClothingType(3, 0.074, Rarity.COMMON));
        clothingTypes.add(new ClothingType(4, 0.074, Rarity.COMMON));
        clothingTypes.add(new ClothingType(5, 0.074, Rarity.COMMON));
        clothingTypes.add(new ClothingType(6, 0.074, Rarity.COMMON));
        clothingTypes.add(new ClothingType(7, 0.07, Rarity.EPIC));
        clothingTypes.add(new ClothingType(8, 0.074, Rarity.COMMON));
        clothingTypes.add(new ClothingType(9, 0.074, Rarity.COMMON));
        clothingTypes.add(new ClothingType(10, 0.074, Rarity.COMMON));
        clothingTypes.add(new ClothingType(11, 0.07, Rarity.EPIC));
        clothingTypes.add(new ClothingType(12, 0.07, Rarity.EPIC));
        clothingTypes.add(new ClothingType(13, 0.025, Rarity.LEGENDARY));
        clothingTypes.add(new ClothingType(14, 0.074, Rarity.COMMON));
        clothingTypes.add(new ClothingType(15, 0.074, Rarity.COMMON));

    }

    static {
        characterTypes.add(new CharacterType(1, 0.1, Rarity.COMMON));
        characterTypes.add(new CharacterType(2, 0.1, Rarity.COMMON));
        characterTypes.add(new CharacterType(3, 0.1, Rarity.COMMON));
        characterTypes.add(new CharacterType(4, 0.1, Rarity.COMMON));
        characterTypes.add(new CharacterType(5, 0.1, Rarity.COMMON));
        characterTypes.add(new CharacterType(6, 0.1, Rarity.COMMON));
        characterTypes.add(new CharacterType(7, 0.09, Rarity.EPIC));
        characterTypes.add(new CharacterType(8, 0.09, Rarity.EPIC));
        characterTypes.add(new CharacterType(9, 0.09, Rarity.EPIC));
        characterTypes.add(new CharacterType(10, 0.08, Rarity.EPIC));
        characterTypes.add(new CharacterType(11, 0.025, Rarity.LEGENDARY));
        characterTypes.add(new CharacterType(12, 0.025, Rarity.LEGENDARY));
    }

    public Integer drawClothingType() {
        Random random = new Random();
        double randomValue = random.nextDouble(); // 0.0 <= randomValue < 1.0
        double cumulativeProbability = 0.0;

        for (ClothingType clothingType : clothingTypes) {
            cumulativeProbability += clothingType.getProbability();
            if (randomValue <= cumulativeProbability) {
                return clothingType.getType();
            }
        }
        return 1; // 기본값 반환
    }

    public Integer drawCharacterType() {
        Random random = new Random();
        double randomValue = random.nextDouble(); // 0.0 <= randomValue < 1.0
        double cumulativeProbability = 0.0;

        for (CharacterType characterType : characterTypes) {
            cumulativeProbability += characterType.getProbability();
            if (randomValue <= cumulativeProbability) {
                return characterType.getType();
            }
        }
        return 1; // 기본값 반환
    }
}
