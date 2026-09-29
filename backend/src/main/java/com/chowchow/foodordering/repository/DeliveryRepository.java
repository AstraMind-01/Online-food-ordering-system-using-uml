package com.chowchow.foodordering.repository;

import com.chowchow.foodordering.entity.Delivery;
import com.chowchow.foodordering.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByOrderId(Long orderId);
    List<Delivery> findByDeliveryPartnerId(Long deliveryPartnerId);
    List<Delivery> findByDeliveryPartnerIdAndStatus(Long deliveryPartnerId, DeliveryStatus status);
}
