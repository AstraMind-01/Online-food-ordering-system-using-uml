package com.chowchow.foodordering.controller;

import com.chowchow.foodordering.dto.ApiResponse;
import com.chowchow.foodordering.dto.OrderCreateRequest;
import com.chowchow.foodordering.dto.OrderResponse;
import com.chowchow.foodordering.dto.OrderStatusUpdateRequest;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.service.AuthService;
import com.chowchow.foodordering.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderCreateRequest request) {
        User user = authService.getCurrentUser();
        OrderResponse order = orderService.createOrderFromCart(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(
            @RequestParam(required = false) com.chowchow.foodordering.entity.OrderStatus status) {
        User user = authService.getCurrentUser();
        List<OrderResponse> orders;
        if (user.getRole() == com.chowchow.foodordering.entity.Role.RESTAURANT) {
            orders = orderService.getRestaurantOrders(user, status);
        } else if (user.getRole() == com.chowchow.foodordering.entity.Role.ADMIN) {
            orders = orderService.getAllOrders(status);
        } else {
            orders = orderService.getCustomerOrders(user);
        }
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders() {
        User user = authService.getCurrentUser();
        List<OrderResponse> orders = orderService.getCustomerOrders(user);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        OrderResponse order = orderService.getOrderById(id, user);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        User user = authService.getCurrentUser();
        OrderResponse order = orderService.updateOrderStatus(id, request.getStatus(), user);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated", order));
    }
}
