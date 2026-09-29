package com.chowchow.foodordering.service;

import com.chowchow.foodordering.dto.DeliveryLocationRequest;
import com.chowchow.foodordering.dto.DeliveryLocationResponse;
import com.chowchow.foodordering.entity.Delivery;
import com.chowchow.foodordering.entity.DeliveryLocation;
import com.chowchow.foodordering.entity.Role;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.exception.ResourceNotFoundException;
import com.chowchow.foodordering.exception.UnauthorizedException;
import com.chowchow.foodordering.repository.DeliveryLocationRepository;
import com.chowchow.foodordering.repository.DeliveryRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryLocationService {

    private final DeliveryLocationRepository deliveryLocationRepository;
    private final DeliveryRepository deliveryRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public DeliveryLocationService(DeliveryLocationRepository deliveryLocationRepository,
                                   DeliveryRepository deliveryRepository,
                                   SimpMessagingTemplate messagingTemplate) {
        this.deliveryLocationRepository = deliveryLocationRepository;
        this.deliveryRepository = deliveryRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public DeliveryLocationResponse recordLocation(Long deliveryId, DeliveryLocationRequest request, User partner) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + deliveryId));

        if (partner.getRole() != Role.ADMIN && (delivery.getDeliveryPartner() == null
                || !delivery.getDeliveryPartner().getId().equals(partner.getId()))) {
            throw new UnauthorizedException("You are not assigned to this delivery");
        }

        DeliveryLocation loc = new DeliveryLocation();
        loc.setDelivery(delivery);
        loc.setLatitude(request.getLatitude());
        loc.setLongitude(request.getLongitude());
        loc.setHeading(request.getHeading() != null ? request.getHeading() : 0.0);
        loc.setSpeed(request.getSpeed() != null ? request.getSpeed() : 0.0);
        loc.setTimestamp(LocalDateTime.now());

        DeliveryLocation saved = deliveryLocationRepository.save(loc);
        DeliveryLocationResponse response = new DeliveryLocationResponse(saved);

        // Push live updates via WebSocket STOMP
        try {
            messagingTemplate.convertAndSend("/topic/deliveries/" + deliveryId + "/location", response);
            if (delivery.getOrder() != null) {
                messagingTemplate.convertAndSend("/topic/orders/" + delivery.getOrder().getId() + "/location", response);
            }
        } catch (Exception e) {
            // Log warning but don't fail transaction
            System.err.println("Failed to broadcast location WebSocket update: " + e.getMessage());
        }

        return response;
    }

    @Transactional(readOnly = true)
    public DeliveryLocationResponse getLatestLocationByDeliveryId(Long deliveryId) {
        return deliveryLocationRepository.findTopByDeliveryIdOrderByTimestampDesc(deliveryId)
                .map(DeliveryLocationResponse::new)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public DeliveryLocationResponse getLatestLocationByOrderId(Long orderId) {
        return deliveryLocationRepository.findTopByDelivery_OrderIdOrderByTimestampDesc(orderId)
                .map(DeliveryLocationResponse::new)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<DeliveryLocationResponse> getLocationHistoryByOrderId(Long orderId) {
        return deliveryLocationRepository.findByDelivery_OrderIdOrderByTimestampAsc(orderId).stream()
                .map(DeliveryLocationResponse::new)
                .collect(Collectors.toList());
    }
}
