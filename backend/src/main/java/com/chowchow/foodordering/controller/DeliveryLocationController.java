package com.chowchow.foodordering.controller;

import com.chowchow.foodordering.dto.ApiResponse;
import com.chowchow.foodordering.dto.DeliveryLocationRequest;
import com.chowchow.foodordering.dto.DeliveryLocationResponse;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.service.AuthService;
import com.chowchow.foodordering.service.DeliveryLocationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DeliveryLocationController {

    private final DeliveryLocationService deliveryLocationService;
    private final AuthService authService;

    public DeliveryLocationController(DeliveryLocationService deliveryLocationService, AuthService authService) {
        this.deliveryLocationService = deliveryLocationService;
        this.authService = authService;
    }

    @PostMapping("/deliveries/{deliveryId}/location")
    public ResponseEntity<ApiResponse<DeliveryLocationResponse>> recordLocation(
            @PathVariable Long deliveryId,
            @Valid @RequestBody DeliveryLocationRequest request) {
        User user = authService.getCurrentUser();
        DeliveryLocationResponse response = deliveryLocationService.recordLocation(deliveryId, request, user);
        return ResponseEntity.ok(ApiResponse.ok("Location recorded successfully", response));
    }

    @GetMapping("/deliveries/{deliveryId}/location")
    public ResponseEntity<ApiResponse<DeliveryLocationResponse>> getLatestDeliveryLocation(
            @PathVariable Long deliveryId) {
        DeliveryLocationResponse response = deliveryLocationService.getLatestLocationByDeliveryId(deliveryId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/orders/{orderId}/delivery-location")
    public ResponseEntity<ApiResponse<DeliveryLocationResponse>> getLatestOrderLocation(
            @PathVariable Long orderId) {
        DeliveryLocationResponse response = deliveryLocationService.getLatestLocationByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/orders/{orderId}/delivery-location/history")
    public ResponseEntity<ApiResponse<List<DeliveryLocationResponse>>> getOrderLocationHistory(
            @PathVariable Long orderId) {
        List<DeliveryLocationResponse> history = deliveryLocationService.getLocationHistoryByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
