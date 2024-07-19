package com.scf.multi.domain.dto.message;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Content {

    private Integer submitTime;
    private Map<Integer, Integer> solve; // 빈칸 문제 대비 map 사용 ex) 0번 째 빈칸 : 1번 보기
}
