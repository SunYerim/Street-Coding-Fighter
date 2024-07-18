package com.scf.multi.domain.repository;

import com.scf.multi.domain.model.MultiGameRoom;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Repository;

@Repository
public class MultiGameRepository {

    private final Map<String, MultiGameRoom> gameRooms = Collections.synchronizedMap(
        new HashMap<>());
}
