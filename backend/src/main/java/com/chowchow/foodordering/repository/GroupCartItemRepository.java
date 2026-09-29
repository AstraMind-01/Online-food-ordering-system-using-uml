package com.chowchow.foodordering.repository;

import com.chowchow.foodordering.entity.GroupCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupCartItemRepository extends JpaRepository<GroupCartItem, Long> {
    List<GroupCartItem> findByGroupOrderId(Long groupOrderId);
    List<GroupCartItem> findByMemberId(Long memberId);
    Optional<GroupCartItem> findByGroupOrderIdAndMemberIdAndFoodItemId(Long groupOrderId, Long memberId, Long foodItemId);
}
