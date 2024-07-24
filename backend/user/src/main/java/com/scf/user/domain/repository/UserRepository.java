package com.scf.user.domain.repository;

import com.scf.user.domain.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableRedisRepositories
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(Long memberId);

    Optional<User> findByUserId(String userId);

    boolean existsByUserId(String userId); // 사용자 ID 존재 여부 확인 메소드


}
