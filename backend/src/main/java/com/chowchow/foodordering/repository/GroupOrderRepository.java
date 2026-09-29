package com.chowchow.foodordering.repository;

import com.chowchow.foodordering.entity.GroupOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupOrderRepository extends JpaRepository<GroupOrder, Long> {
    Optional<GroupOrder> findByGroupCode(String groupCode);
    boolean existsByGroupCode(String groupCode);
    List<GroupOrder> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    List<GroupOrder> findAllByOrderByCreatedAtDesc();
}
