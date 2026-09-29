package com.chowchow.foodordering.repository;

import com.chowchow.foodordering.entity.DeliveryLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryLocationRepository extends JpaRepository<DeliveryLocation, Long> {

    List<DeliveryLocation> findByDeliveryIdOrderByTimestampAsc(Long deliveryId);

    Optional<DeliveryLocation> findTopByDeliveryIdOrderByTimestampDesc(Long deliveryId);

    Optional<DeliveryLocation> findTopByDelivery_OrderIdOrderByTimestampDesc(Long orderId);

    List<DeliveryLocation> findByDelivery_OrderIdOrderByTimestampAsc(Long orderId);
}
