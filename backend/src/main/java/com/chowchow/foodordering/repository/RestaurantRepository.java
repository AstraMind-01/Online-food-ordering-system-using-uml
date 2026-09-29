package com.chowchow.foodordering.repository;

import com.chowchow.foodordering.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByOpenTrue();
    Optional<Restaurant> findByOwnerId(Long ownerId);
}
