package com.chowchow.foodordering.repository;

import com.chowchow.foodordering.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroupOrderId(Long groupOrderId);
    Optional<GroupMember> findByGroupOrderIdAndUserId(Long groupOrderId, Long userId);
    boolean existsByGroupOrderIdAndUserId(Long groupOrderId, Long userId);
}
