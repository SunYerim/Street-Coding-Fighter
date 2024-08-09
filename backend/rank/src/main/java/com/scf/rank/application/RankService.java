package com.scf.rank.application;

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
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RankService {

    private final RedisTemplate<String, UserExp> redisTemplate;
    private static final String KEY_PREFIX = "user:";
    private static final String ALL_TIME_KEY = "user:alltime";
    private static final String WEEKLY_KEY = "user:weekly:";
    private static final String DAILY_KEY = "user:daily:";

    private ZSetOperations<String, UserExp> zSetOps() {
        return redisTemplate.opsForZSet();
    }

    public List<UserExp> getAllTimeRankings() {
        return getRankings(ALL_TIME_KEY);
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

        // 전체 기간
        if (datePrefix == null) {
            zSetOps().add(ALL_TIME_KEY, userExp, userExp.getExp());
            return;
        }

        // 기간별 (주간, 일간)
        zSetOps().add(datePrefix, userExp, userExp.getExp());
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
        return WEEKLY_KEY + date.getYear() + "-" + weekOfYear;
    }

    public String getDailyPrefix(LocalDate date) {
        // 일간 랭킹 키 생성 (예: "user:daily:2024-07-31")
        return DAILY_KEY + date.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }
}
