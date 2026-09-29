package com.chowchow.foodordering.service;

import com.chowchow.foodordering.dto.OrderCreateRequest;
import com.chowchow.foodordering.dto.OrderResponse;
import com.chowchow.foodordering.entity.*;
import com.chowchow.foodordering.exception.BadRequestException;
import com.chowchow.foodordering.exception.ResourceNotFoundException;
import com.chowchow.foodordering.exception.UnauthorizedException;
import com.chowchow.foodordering.repository.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final RestaurantRepository restaurantRepository;
    private final PaymentRepository paymentRepository;
    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        RestaurantRepository restaurantRepository,
                        PaymentRepository paymentRepository,
                        DeliveryRepository deliveryRepository,
                        UserRepository userRepository,
                        SimpMessagingTemplate messagingTemplate) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.restaurantRepository = restaurantRepository;
        this.paymentRepository = paymentRepository;
        this.deliveryRepository = deliveryRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public OrderResponse createOrderFromCart(User customer, OrderCreateRequest request) {
        Cart cart = cartRepository.findByCustomerId(customer.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot create order from an empty cart");
        }

        // Determine Restaurant
        Restaurant restaurant;
        if (request.getRestaurantId() != null) {
            restaurant = restaurantRepository.findById(request.getRestaurantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        } else {
            restaurant = cart.getItems().get(0).getFoodItem().getRestaurant();
        }

        double total = cart.getItems().stream()
                .mapToDouble(ci -> ci.getFoodItem().getPrice() * ci.getQuantity())
                .sum();

        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setTotalAmount(total);
        order.setDeliveryAddress(request.getDeliveryAddress() != null && !request.getDeliveryAddress().isBlank()
                ? request.getDeliveryAddress()
                : customer.getAddress());
        order.setDeliveryLatitude(request.getDeliveryLatitude() != null ? request.getDeliveryLatitude() : 30.2849);
        order.setDeliveryLongitude(request.getDeliveryLongitude() != null ? request.getDeliveryLongitude() : -97.7341);
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());

        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem(order, ci.getFoodItem(), ci.getQuantity(), ci.getFoodItem().getPrice());
            order.addItem(oi);
        }

        Order savedOrder = orderRepository.save(order);

        // Clear user cart
        cart.getItems().clear();
        cartRepository.save(cart);

        OrderResponse response = mapToResponse(savedOrder);

        // WebSocket broadcast for new order
        try {
            messagingTemplate.convertAndSend("/topic/orders", response);
            if (restaurant != null && restaurant.getId() != null) {
                messagingTemplate.convertAndSend("/topic/restaurants/" + restaurant.getId() + "/orders", response);
            }
        } catch (Exception e) {
            System.err.println("Failed to broadcast new order WebSocket: " + e.getMessage());
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getCustomerOrders(User customer) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getRestaurantOrders(User owner, OrderStatus status) {
        Restaurant restaurant = restaurantRepository.findByOwnerId(owner.getId()).orElse(null);
        if (restaurant == null) {
            return List.of();
        }
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByRestaurantIdAndStatusOrderByCreatedAtDesc(restaurant.getId(), status);
        } else {
            orders = orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurant.getId());
        }
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders(OrderStatus status) {
        List<Order> orders = status != null
                ? orderRepository.findByStatusOrderByCreatedAtDesc(status)
                : orderRepository.findAllByOrderByCreatedAtDesc();
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, User currentUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        validateOrderViewAccess(order, currentUser);

        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus, User currentUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus currentStatus = order.getStatus();

        // Validate state transitions per UML State Chart
        validateStateTransition(currentStatus, newStatus);

        // Validate user role permissions for this transition
        validateRoleForTransition(order, newStatus, currentUser);

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);

        // When moving to READY_FOR_PICKUP, order is available for delivery partners to claim in /delivery/available

        // When moving to OUT_FOR_DELIVERY or DELIVERED, update Delivery record
        if (newStatus == OrderStatus.OUT_FOR_DELIVERY || newStatus == OrderStatus.DELIVERED) {
            deliveryRepository.findByOrderId(order.getId()).ifPresent(del -> {
                if (newStatus == OrderStatus.OUT_FOR_DELIVERY) {
                    del.setStatus(DeliveryStatus.PICKED_UP);
                    del.setPickedUpAt(LocalDateTime.now());
                } else {
                    del.setStatus(DeliveryStatus.DELIVERED);
                    del.setDeliveredAt(LocalDateTime.now());
                }
                deliveryRepository.save(del);
            });
        }

        OrderResponse response = mapToResponse(updated);

        // Push order status update via WebSocket
        try {
            messagingTemplate.convertAndSend("/topic/orders/" + orderId, response);
            messagingTemplate.convertAndSend("/topic/orders", response);
            if (order.getRestaurant() != null && order.getRestaurant().getId() != null) {
                messagingTemplate.convertAndSend("/topic/restaurants/" + order.getRestaurant().getId() + "/orders", response);
            }
        } catch (Exception e) {
            System.err.println("Failed to broadcast order status update WebSocket: " + e.getMessage());
        }

        return response;
    }

    private void validateStateTransition(OrderStatus current, OrderStatus next) {
        if (current == next) {
            return;
        }

        if (current == OrderStatus.DELIVERED || current == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is in a terminal state (" + current + ") and cannot be changed");
        }

        boolean isValid = switch (current) {
            case PLACED -> (next == OrderStatus.CONFIRMED || next == OrderStatus.CANCELLED);
            case CONFIRMED -> (next == OrderStatus.PREPARING || next == OrderStatus.CANCELLED);
            case PREPARING -> (next == OrderStatus.READY_FOR_PICKUP || next == OrderStatus.CANCELLED);
            case READY_FOR_PICKUP -> (next == OrderStatus.OUT_FOR_DELIVERY || next == OrderStatus.CANCELLED);
            case OUT_FOR_DELIVERY -> (next == OrderStatus.DELIVERED || next == OrderStatus.CANCELLED);
            default -> false;
        };

        if (!isValid) {
            throw new BadRequestException("Invalid state transition from " + current + " to " + next);
        }
    }

    private void validateRoleForTransition(Order order, OrderStatus newStatus, User user) {
        if (user.getRole() == Role.ADMIN) {
            return;
        }

        if (user.getRole() == Role.CUSTOMER) {
            if (newStatus == OrderStatus.CANCELLED && order.getStatus() == OrderStatus.PLACED
                    && order.getCustomer().getId().equals(user.getId())) {
                return;
            }
            throw new UnauthorizedException("Customers can only cancel unconfirmed orders");
        }

        if (user.getRole() == Role.RESTAURANT) {
            if (order.getRestaurant() != null && order.getRestaurant().getOwner() != null
                    && order.getRestaurant().getOwner().getId().equals(user.getId())) {
                if (newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.PREPARING
                        || newStatus == OrderStatus.READY_FOR_PICKUP || newStatus == OrderStatus.CANCELLED) {
                    return;
                }
            }
            throw new UnauthorizedException("Restaurant owners can only update orders for their restaurant");
        }

        if (user.getRole() == Role.DELIVERY_PARTNER) {
            if (newStatus == OrderStatus.OUT_FOR_DELIVERY || newStatus == OrderStatus.DELIVERED) {
                return;
            }
            throw new UnauthorizedException("Delivery partners can only update delivery statuses");
        }

        throw new UnauthorizedException("Insufficient permissions to update order status");
    }

    private void assignDeliveryPartner(Order order) {
        if (deliveryRepository.findByOrderId(order.getId()).isPresent()) {
            return;
        }

        List<User> drivers = userRepository.findByRole(Role.DELIVERY_PARTNER);
        if (!drivers.isEmpty()) {
            User driver = drivers.get(0);
            Delivery delivery = new Delivery(order, driver, DeliveryStatus.ASSIGNED);
            deliveryRepository.save(delivery);
        }
    }

    private void validateOrderViewAccess(Order order, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }
        if (order.getCustomer() != null && order.getCustomer().getId().equals(currentUser.getId())) {
            return;
        }
        if (order.getRestaurant() != null && order.getRestaurant().getOwner() != null
                && order.getRestaurant().getOwner().getId().equals(currentUser.getId())) {
            return;
        }
        Delivery delivery = deliveryRepository.findByOrderId(order.getId()).orElse(null);
        if (delivery != null && delivery.getDeliveryPartner() != null
                && delivery.getDeliveryPartner().getId().equals(currentUser.getId())) {
            return;
        }

        throw new UnauthorizedException("You do not have access to view this order");
    }

    public OrderResponse mapToResponse(Order order) {
        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
        Delivery delivery = deliveryRepository.findByOrderId(order.getId()).orElse(null);
        return new OrderResponse(order, payment, delivery);
    }
}
