package com.scf.rank.constant;

public enum RedisRankType {

    ALL_TIME("rank:alltime:"),
    WEEKLY("rank:weekly:"),
    DAILY("rank:daily:");
    public final String key;
    RedisRankType(String key) {
        this.key = key;
    }

}
