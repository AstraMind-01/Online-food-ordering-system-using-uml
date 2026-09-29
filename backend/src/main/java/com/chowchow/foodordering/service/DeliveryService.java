package com.chowchow.foodordering.service;

import com.chowchow.foodordering.dto.DeliveryResponse;
import com.chowchow.foodordering.entity.*;
import com.chowchow.foodordering.exception.BadRequestException;
import com.chowchow.foodordering.exception.ResourceNotFoundException;
import com.chowchow.foodordering.exception.UnauthorizedException;
import com.chowchow.foodordering.repository.DeliveryRepository;
import com.chowchow.foodordering.repository.OrderRepository;
import com.chowchow.foodordering.repository.RestaurantRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           OrderRepository orderRepository,
                           RestaurantRepository restaurantRepository,
                           SimpMessagingTemplate messagingTemplate) {
        this.deliveryRepository = deliveryRepository;
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional(readOnly = true)
    public List<DeliveryResponse> getAvailableDeliveries(User partner) {
        // If partner is offline, return empty list
        if (!partner.isOnline()) {
            return List.of();
        }

        // Find all orders that are READY_FOR_PICKUP and not yet accepted by any partner
        List<Order> readyOrders = orderRepository.findByStatusOrderByCreatedAtDesc(OrderStatus.READY_FOR_PICKUP);

        return readyOrders.stream()
                .filter(order -> deliveryRepository.findByOrderId(order.getId())
                        .map(d -> d.getDeliveryPartner() == null)
                        .orElse(true))
                .map(DeliveryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeliveryResponse acceptDelivery(Long orderId, User partner) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getStatus() != OrderStatus.READY_FOR_PICKUP) {
            throw new BadRequestException("Order is not ready for pickup (current status: " + order.getStatus() + ")");
        }

        Delivery existing = deliveryRepository.findByOrderId(orderId).orElse(null);
        if (existing != null && existing.getDeliveryPartner() != null) {
            if (!existing.getDeliveryPartner().getId().equals(partner.getId())) {
                throw new BadRequestException("This delivery has already been accepted by another courier partner");
            }
            return new DeliveryResponse(existing);
        }

        Delivery delivery = existing != null ? existing : new Delivery();
        delivery.setOrder(order);
        delivery.setDeliveryPartner(partner);
        Delivery saved = deliveryRepository.save(delivery);
        DeliveryResponse response = new DeliveryResponse(saved);

        // Broadcast delivery acceptance
        try {
            messagingTemplate.convertAndSend("/topic/deliveries", response);
            messagingTemplate.convertAndSend("/topic/deliveries/" + saved.getId(), response);
            if (order.getId() != null) {
                messagingTemplate.convertAndSend("/topic/orders/" + order.getId(), response);
            }
        } catch (Exception e) {
            System.err.println("Failed to broadcast delivery acceptance WebSocket: " + e.getMessage());
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<DeliveryResponse> getAssignedDeliveries(User partner) {
        return deliveryRepository.findByDeliveryPartnerId(partner.getId()).stream()
                .filter(d -> d.getStatus() != DeliveryStatus.DELIVERED && d.getStatus() != DeliveryStatus.CANCELLED)
                .map(DeliveryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeliveryResponse> getDeliveryHistory(User partner, String period) {
        List<Delivery> list = deliveryRepository.findByDeliveryPartnerId(partner.getId()).stream()
                .filter(d -> d.getStatus() == DeliveryStatus.DELIVERED || d.getStatus() == DeliveryStatus.CANCELLED)
                .collect(Collectors.toList());

        LocalDateTime now = LocalDateTime.now();
        if ("TODAY".equalsIgnoreCase(period)) {
            LocalDate today = LocalDate.now();
            list = list.stream()
                    .filter(d -> d.getDeliveredAt() != null && d.getDeliveredAt().toLocalDate().isEqual(today))
                    .collect(Collectors.toList());
        } else if ("WEEK".equalsIgnoreCase(period)) {
            LocalDateTime weekAgo = now.minusDays(7);
            list = list.stream()
                    .filter(d -> d.getDeliveredAt() != null && d.getDeliveredAt().isAfter(weekAgo))
                    .collect(Collectors.toList());
        }

        return list.stream().map(DeliveryResponse::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeliveryResponse> getDeliveriesForUser(User user) {
        if (user.getRole() == Role.RESTAURANT) {
            Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId()).orElse(null);
            if (restaurant == null) {
                return List.of();
            }
            List<Order> orders = orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurant.getId());
            List<Long> orderIds = orders.stream().map(Order::getId).collect(Collectors.toList());
            return deliveryRepository.findAll().stream()
                    .filter(d -> d.getOrder() != null && orderIds.contains(d.getOrder().getId()))
                    .map(DeliveryResponse::new)
                    .collect(Collectors.toList());
        }
        return deliveryRepository.findAll().stream()
                .map(DeliveryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeliveryResponse updateDeliveryStatus(Long deliveryId, DeliveryStatus targetStatus, User partner) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + deliveryId));

        if (partner.getRole() != Role.ADMIN && (delivery.getDeliveryPartner() == null
                || !delivery.getDeliveryPartner().getId().equals(partner.getId()))) {
            throw new UnauthorizedException("You are not assigned to this delivery ticket");
        }

        DeliveryStatus currentStatus = delivery.getStatus();

        // Enforce valid courier state machine transitions
        if (currentStatus == DeliveryStatus.ASSIGNED) {
            if (targetStatus != DeliveryStatus.PICKED_UP && targetStatus != DeliveryStatus.CANCELLED) {
                throw new BadRequestException("Assigned delivery must be marked PICKED UP before delivering");
            }
        } else if (currentStatus == DeliveryStatus.PICKED_UP) {
            if (targetStatus != DeliveryStatus.DELIVERED && targetStatus != DeliveryStatus.CANCELLED) {
                throw new BadRequestException("Picked up order can only transition to DELIVERED or CANCELLED");
            }
        } else if (currentStatus == DeliveryStatus.DELIVERED || currentStatus == DeliveryStatus.CANCELLED) {
            throw new BadRequestException("Delivery is already in terminal state (" + currentStatus + ")");
        }

        delivery.setStatus(targetStatus);
        if (targetStatus == DeliveryStatus.PICKED_UP) {
            delivery.setPickedUpAt(LocalDateTime.now());
            if (delivery.getOrder() != null) {
                delivery.getOrder().setStatus(OrderStatus.OUT_FOR_DELIVERY);
                orderRepository.save(delivery.getOrder());
            }
        } else if (targetStatus == DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(LocalDateTime.now());
            if (delivery.getOrder() != null) {
                delivery.getOrder().setStatus(OrderStatus.DELIVERED);
                orderRepository.save(delivery.getOrder());
            }
        }

        Delivery saved = deliveryRepository.save(delivery);
        DeliveryResponse response = new DeliveryResponse(saved);

        // Broadcast delivery status change
        try {
            messagingTemplate.convertAndSend("/topic/deliveries", response);
            messagingTemplate.convertAndSend("/topic/deliveries/" + saved.getId(), response);
            if (delivery.getOrder() != null && delivery.getOrder().getId() != null) {
                messagingTemplate.convertAndSend("/topic/orders/" + delivery.getOrder().getId(), response);
            }
        } catch (Exception e) {
            System.err.println("Failed to broadcast delivery status WebSocket: " + e.getMessage());
        }

        return response;
    }
}
