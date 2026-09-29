package com.chowchow.foodordering.service;

import com.chowchow.foodordering.dto.*;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.exception.ResourceNotFoundException;
import com.chowchow.foodordering.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final DeliveryRepository deliveryRepository;
    private final GroupOrderRepository groupOrderRepository;

    public AdminService(UserRepository userRepository,
                        RestaurantRepository restaurantRepository,
                        OrderRepository orderRepository,
                        PaymentRepository paymentRepository,
                        DeliveryRepository deliveryRepository,
                        GroupOrderRepository groupOrderRepository) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.deliveryRepository = deliveryRepository;
        this.groupOrderRepository = groupOrderRepository;
    }

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.findByRole(com.chowchow.foodordering.entity.Role.CUSTOMER).size();
        long totalRestaurants = restaurantRepository.count();
        long totalDeliveryPartners = userRepository.findByRole(com.chowchow.foodordering.entity.Role.DELIVERY_PARTNER).size();
        long totalOrders = orderRepository.count();
        double totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == com.chowchow.foodordering.entity.PaymentStatus.PAID)
                .mapToDouble(com.chowchow.foodordering.entity.Payment::getAmount)
                .sum();
        long activeOrders = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != com.chowchow.foodordering.entity.OrderStatus.DELIVERED
                        && o.getStatus() != com.chowchow.foodordering.entity.OrderStatus.CANCELLED)
                .count();
        long activeDeliveries = deliveryRepository.findAll().stream()
                .filter(d -> d.getStatus() != com.chowchow.foodordering.entity.DeliveryStatus.DELIVERED
                        && d.getStatus() != com.chowchow.foodordering.entity.DeliveryStatus.CANCELLED)
                .count();
        long totalGroupOrders = groupOrderRepository.count();

        return new AdminStatsResponse(totalUsers, totalCustomers, totalRestaurants,
                totalDeliveryPartners, totalOrders, totalRevenue,
                activeOrders, activeDeliveries, totalGroupOrders);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(RestaurantResponse::new)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(o -> new OrderResponse(o, paymentRepository.findByOrderId(o.getId()).orElse(null),
                        deliveryRepository.findByOrderId(o.getId()).orElse(null)))
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentResponse::new)
                .collect(Collectors.toList());
    }

    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryRepository.findAll().stream()
                .map(DeliveryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse setUserActive(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setActive(active);
        User saved = userRepository.save(user);
        return new UserResponse(saved);
    }
}
