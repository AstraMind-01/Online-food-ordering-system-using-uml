package com.chowchow.foodordering.controller;

import com.chowchow.foodordering.dto.ApiResponse;
import com.chowchow.foodordering.dto.DeliveryResponse;
import com.chowchow.foodordering.dto.DeliveryStatusUpdateRequest;
import com.chowchow.foodordering.entity.DeliveryStatus;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.service.AuthService;
import com.chowchow.foodordering.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final AuthService authService;

    public DeliveryController(DeliveryService deliveryService, AuthService authService) {
        this.deliveryService = deliveryService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getDeliveries() {
        User user = authService.getCurrentUser();
        List<DeliveryResponse> list = deliveryService.getDeliveriesForUser(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getAvailableDeliveries() {
        User user = authService.getCurrentUser();
        List<DeliveryResponse> list = deliveryService.getAvailableDeliveries(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/{orderId}/accept")
    public ResponseEntity<ApiResponse<DeliveryResponse>> acceptDelivery(@PathVariable Long orderId) {
        User user = authService.getCurrentUser();
        DeliveryResponse response = deliveryService.acceptDelivery(orderId, user);
        return ResponseEntity.ok(ApiResponse.ok("Delivery accepted and assigned to your route", response));
    }

    @GetMapping("/assigned")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getAssignedDeliveries() {
        User user = authService.getCurrentUser();
        List<DeliveryResponse> list = deliveryService.getAssignedDeliveries(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getDeliveryHistory(
            @RequestParam(required = false, defaultValue = "ALL") String period) {
        User user = authService.getCurrentUser();
        List<DeliveryResponse> list = deliveryService.getDeliveryHistory(user, period);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DeliveryResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody DeliveryStatusUpdateRequest request) {
        User user = authService.getCurrentUser();
        DeliveryResponse response = deliveryService.updateDeliveryStatus(id, request.getStatus(), user);
        return ResponseEntity.ok(ApiResponse.ok("Delivery status updated", response));
    }
}
