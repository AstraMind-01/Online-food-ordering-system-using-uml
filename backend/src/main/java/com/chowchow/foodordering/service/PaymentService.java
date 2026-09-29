package com.chowchow.foodordering.service;

import com.chowchow.foodordering.dto.PaymentResponse;
import com.chowchow.foodordering.dto.PaymentRequest;
import com.chowchow.foodordering.entity.Order;
import com.chowchow.foodordering.entity.Payment;
import com.chowchow.foodordering.entity.PaymentStatus;
import com.chowchow.foodordering.entity.Restaurant;
import com.chowchow.foodordering.entity.Role;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.exception.BadRequestException;
import com.chowchow.foodordering.exception.ResourceNotFoundException;
import com.chowchow.foodordering.exception.UnauthorizedException;
import com.chowchow.foodordering.repository.OrderRepository;
import com.chowchow.foodordering.repository.PaymentRepository;
import com.chowchow.foodordering.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          RestaurantRepository restaurantRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @Transactional
    public PaymentResponse processPayment(User user, PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        if (!order.getCustomer().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Cannot pay for another user's order");
        }

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseGet(() -> new Payment(order, order.getTotalAmount(), request.getMethod(), PaymentStatus.PENDING, null, null));

        if (payment.getStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Order is already paid");
        }

        // Simulate successful payment
        payment.setAmount(order.getTotalAmount());
        payment.setMethod(request.getMethod());
        payment.setStatus(PaymentStatus.PAID);
        payment.setTransactionRef("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setPaidAt(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);
        return new PaymentResponse(saved);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(Long orderId, User user) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order id: " + orderId));
        return new PaymentResponse(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsForUser(User user) {
        if (user.getRole() == Role.RESTAURANT) {
            Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId()).orElse(null);
            if (restaurant == null) {
                return List.of();
            }
            List<Order> orders = orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurant.getId());
            List<Long> orderIds = orders.stream().map(Order::getId).collect(Collectors.toList());
            return paymentRepository.findAll().stream()
                    .filter(p -> p.getOrder() != null && orderIds.contains(p.getOrder().getId()))
                    .map(PaymentResponse::new)
                    .collect(Collectors.toList());
        }
        return paymentRepository.findAll().stream()
                .map(PaymentResponse::new)
                .collect(Collectors.toList());
    }
}
