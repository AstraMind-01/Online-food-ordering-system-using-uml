package com.chowchow.foodordering.controller;

import com.chowchow.foodordering.dto.ApiResponse;
import com.chowchow.foodordering.dto.CartItemRequest;
import com.chowchow.foodordering.dto.CartResponse;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.service.AuthService;
import com.chowchow.foodordering.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        User user = authService.getCurrentUser();
        CartResponse cart = cartService.getCartForCustomer(user);
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItemToCart(@Valid @RequestBody CartItemRequest request) {
        User user = authService.getCurrentUser();
        CartResponse cart = cartService.addItemToCart(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", cart));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItemQuantity(
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        User user = authService.getCurrentUser();
        CartResponse cart = cartService.updateCartItemQuantity(user, itemId, quantity);
        return ResponseEntity.ok(ApiResponse.ok("Cart updated", cart));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(@PathVariable Long itemId) {
        User user = authService.getCurrentUser();
        CartResponse cart = cartService.removeCartItem(user, itemId);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", cart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<CartResponse>> clearCart() {
        User user = authService.getCurrentUser();
        CartResponse cart = cartService.clearCart(user);
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared", cart));
    }
}
