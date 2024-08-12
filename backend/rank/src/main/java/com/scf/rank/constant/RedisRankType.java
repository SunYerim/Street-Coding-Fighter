package com.scf.rank.constant;

public enum RedisRankType {

    ALL_TIME("rank:total"),
    WEEKLY("rank:weekly"),
    DAILY("rank:daily");
    public final String key;
    RedisRankType(String key) {
        this.key = key;
    }

}
