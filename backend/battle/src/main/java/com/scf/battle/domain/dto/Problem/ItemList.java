package com.scf.battle.domain.dto.Problem;

import com.scf.battle.domain.enums.ItemType;
import com.scf.battle.domain.enums.Rarity;

import java.util.Arrays;
import java.util.List;

public class ItemList {
    public static final List<Item> items = Arrays.asList(
            new Item("혼란의 스크린", ItemType.ATTACK, new double[] {0.2, 0.2, 0.2, 0.1, 0.1}, Rarity.COMMON),
            new Item("시간 단축", ItemType.ATTACK, new double[] {0.2, 0.2, 0.2, 0.1, 0.1}, Rarity.COMMON),
            new Item("오답 유도", ItemType.ATTACK, new double[] {0.2, 0.2, 0.2, 0.2, 0.1}, Rarity.UNCOMMON),
            new Item("문제 변경", ItemType.ATTACK, new double[] {0.2, 0.2, 0.2, 0.2, 0.1}, Rarity.UNCOMMON),
            new Item("시간 경과 아이템", ItemType.ATTACK, new double[] {0.2, 0.2, 0.2, 0.2, 0.1}, Rarity.UNCOMMON),
            new Item("시간 연장", ItemType.DEFENSE, new double[] {0.2, 0.2, 0.2, 0.1, 0.1}, Rarity.COMMON),
            new Item("오답 제거", ItemType.DEFENSE, new double[] {0.2, 0.2, 0.2, 0.2, 0.1}, Rarity.UNCOMMON),
            new Item("무적 시간", ItemType.SPECIAL, new double[] {0.0, 0.0, 0.1, 0.1, 0.2}, Rarity.RARE),
            new Item("더블 포인트", ItemType.SPECIAL, new double[] {0.0, 0.0, 0.0, 0.1, 0.2}, Rarity.EPIC),
            new Item("회복 아이템", ItemType.SPECIAL, new double[] {0.0, 0.0, 0.0, 0.1, 0.2}, Rarity.LEGENDARY)
    );
}
