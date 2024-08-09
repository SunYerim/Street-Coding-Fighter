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
        clothingTypes.add(new ClothingType(1, 0.2, Rarity.COMMON));
        clothingTypes.add(new ClothingType(2, 0.15, Rarity.UNCOMMON));
        clothingTypes.add(new ClothingType(3, 0.15, Rarity.UNCOMMON));
        clothingTypes.add(new ClothingType(5, 0.1, Rarity.RARE));
        clothingTypes.add(new ClothingType(9, 0.1, Rarity.RARE));
        clothingTypes.add(new ClothingType(12, 0.1, Rarity.EPIC));
        clothingTypes.add(new ClothingType(13, 0.05, Rarity.LEGENDARY));
        clothingTypes.add(new ClothingType(14, 0.05, Rarity.LEGENDARY));
        clothingTypes.add(new ClothingType(15, 0.1, Rarity.EPIC));
    }

    static {
        characterTypes.add(new CharacterType(1, 0.2, Rarity.COMMON));
        characterTypes.add(new CharacterType(2, 0.15, Rarity.UNCOMMON));
        characterTypes.add(new CharacterType(3, 0.15, Rarity.UNCOMMON));
        characterTypes.add(new CharacterType(4, 0.1, Rarity.RARE));
        characterTypes.add(new CharacterType(5, 0.1, Rarity.RARE));
        characterTypes.add(new CharacterType(6, 0.1, Rarity.EPIC));
        characterTypes.add(new CharacterType(7, 0.05, Rarity.LEGENDARY));
        characterTypes.add(new CharacterType(8, 0.05, Rarity.LEGENDARY));
        characterTypes.add(new CharacterType(9, 0.05, Rarity.LEGENDARY));
        characterTypes.add(new CharacterType(10, 0.05, Rarity.LEGENDARY));
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
