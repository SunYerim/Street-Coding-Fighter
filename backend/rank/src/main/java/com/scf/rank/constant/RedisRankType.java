package com.scf.rank.constant;

public enum RedisRankType {

    ALL_TIME("user:alltime"),
    WEEKLY("user:weekly"),
    DAILY("user:daily");
    public final String key;
    RedisRankType(String key) {
        this.key = key;
    }

}
