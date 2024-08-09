package com.scf.rank.application;

import com.scf.rank.constant.RedisRankType;
import com.scf.rank.domain.model.UserExp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RankService {

    private final RedisTemplate<String, UserExp> redisTemplate;
    private static final String KEY_PREFIX = "user:";

    private ZSetOperations<String, UserExp> zSetOps() {
        return redisTemplate.opsForZSet();
    }

    public List<UserExp> getAllTimeRankings() {
        return getRankings(RedisRankType.ALL_TIME.key);
    }

    public List<UserExp> getWeeklyRankings() {
        return getRankings(getWeeklyPrefix(LocalDate.now()));
    }

    public List<UserExp> getDailyRankings() {
        return getRankings(getDailyPrefix(LocalDate.now()));
    }

    public UserExp getUserRank(Long userId) {

        String key = KEY_PREFIX + userId;

        ValueOperations<String, UserExp> valueOps = redisTemplate.opsForValue();

        return valueOps.get(key);
    }

    public void updateRank(UserExp userExp, String datePrefix) {
        // 플레이어가 이미 점수를 가지고 있는지 확인
        Double currentScore = zSetOps().score(datePrefix, userExp);

        // 플레이어가 존재하면 점수를 증가시키고, 그렇지 않으면 추가
        if (currentScore != null) {
            zSetOps().incrementScore(datePrefix, userExp, userExp.getExp());
        } else {
            zSetOps().add(datePrefix, userExp, userExp.getExp());
        }
    }

    private List<UserExp> getRankings(String datePrefix) {

        Set<ZSetOperations.TypedTuple<UserExp>> rankedUsers = zSetOps().reverseRangeWithScores(
            datePrefix, 0, -1);

        List<UserExp> ranks = new ArrayList<>();
        if (rankedUsers != null) {
            for (ZSetOperations.TypedTuple<UserExp> tuple : rankedUsers) {
                ranks.add(tuple.getValue());
            }
        }
        return ranks;
    }

    public String getWeeklyPrefix(LocalDate date) {
        // 주간 랭킹 키 생성 (예: "user:weekly:2024-W31")
        String weekOfYear = String.format("W%02d", date.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR));
        return RedisRankType.WEEKLY.key + date.getYear() + "-" + weekOfYear;
    }

    public String getDailyPrefix(LocalDate date) {
        // 일간 랭킹 키 생성 (예: "user:daily:2024-07-31")
        return RedisRankType.DAILY.key + date.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    // 일간 랭킹 초기화
    @Scheduled(cron = "59 59 23 * * ?") // 매일 23:59에 실행
    public void resetDailyRankings() {
        Set<String> dailyKeys = redisTemplate.keys("user:daily:*");
        if (dailyKeys != null && !dailyKeys.isEmpty()) {
            redisTemplate.delete(dailyKeys);
        }
    }

    // 주간 랭킹 초기화
    @Scheduled(cron = "59 59 23 ? * SUN") // 매주 일요일 23:59에 실행
    public void resetWeeklyRankings() {
        Set<String> weeklyKeys = redisTemplate.keys("user:weekly:*");
        if (weeklyKeys != null && !weeklyKeys.isEmpty()) {
            redisTemplate.delete(weeklyKeys);
        }
    }
}
