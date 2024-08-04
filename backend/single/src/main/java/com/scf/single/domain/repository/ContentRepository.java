package com.scf.single.domain.repository;

import com.scf.single.domain.entity.Content;
import com.scf.single.domain.entity.ContentCheckUser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    List<ContentCheckUser> findByMemberId(Long memberId);

}
