package com.chowchow.foodordering.controller;

import com.chowchow.foodordering.dto.ApiResponse;
import com.chowchow.foodordering.dto.PaymentRequest;
import com.chowchow.foodordering.dto.PaymentResponse;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.service.AuthService;
import com.chowchow.foodordering.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final AuthService authService;

    public PaymentController(PaymentService paymentService, AuthService authService) {
        this.paymentService = paymentService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(@Valid @RequestBody PaymentRequest request) {
        User user = authService.getCurrentUser();
        PaymentResponse response = paymentService.processPayment(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPayments() {
        User user = authService.getCurrentUser();
        List<PaymentResponse> list = paymentService.getPaymentsForUser(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrder(@PathVariable Long orderId) {
        User user = authService.getCurrentUser();
        PaymentResponse response = paymentService.getPaymentByOrderId(orderId, user);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
