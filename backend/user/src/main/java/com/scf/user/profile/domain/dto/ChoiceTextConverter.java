package com.scf.user.profile.domain.dto;

import java.util.Map;
import java.util.StringJoiner;

public class ChoiceTextConverter {

    public static String convertChoiceText(Map<Integer, Integer> choiceTextMap, String text) {
        // 주관식
        if (choiceTextMap == null || choiceTextMap.isEmpty()) {
            return text;
        }

        // 객관식
        if (choiceTextMap.size() == 1) {
            return choiceTextMap.entrySet().iterator().next().getKey() + "="
                + choiceTextMap.entrySet().iterator().next().getValue();
        }

        // 빈칸 형식
        StringJoiner joiner = new StringJoiner(";");
        for (Map.Entry<Integer, Integer> entry : choiceTextMap.entrySet()) {
            joiner.add(entry.getKey() + "=" + entry.getValue());
        }

        return joiner.toString();
    }

}
