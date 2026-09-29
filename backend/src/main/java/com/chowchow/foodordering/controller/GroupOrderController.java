package com.chowchow.foodordering.controller;

import com.chowchow.foodordering.dto.*;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.service.AuthService;
import com.chowchow.foodordering.service.GroupOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group-orders")
public class GroupOrderController {

    private final GroupOrderService groupOrderService;
    private final AuthService authService;

    public GroupOrderController(GroupOrderService groupOrderService, AuthService authService) {
        this.groupOrderService = groupOrderService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GroupOrderResponse>> createGroupOrder(
            @Valid @RequestBody GroupOrderCreateRequest request) {
        User user = authService.getCurrentUser();
        GroupOrderResponse response = groupOrderService.createGroupOrder(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Group order booth created", response));
    }

    @PostMapping("/join")
    public ResponseEntity<ApiResponse<GroupOrderResponse>> joinGroupOrder(
            @Valid @RequestBody GroupOrderJoinRequest request) {
        User user = authService.getCurrentUser();
        GroupOrderResponse response = groupOrderService.joinGroupOrder(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Joined group order successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GroupOrderResponse>> getGroupOrderById(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        GroupOrderResponse response = groupOrderService.getGroupOrderById(id, user);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/code/{groupCode}")
    public ResponseEntity<ApiResponse<GroupOrderResponse>> getGroupOrderByCode(@PathVariable String groupCode) {
        User user = authService.getCurrentUser();
        GroupOrderResponse response = groupOrderService.getGroupOrderByCode(groupCode, user);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<ApiResponse<GroupOrderResponse>> addItemToGroupCart(
            @PathVariable Long id,
            @Valid @RequestBody GroupCartItemRequest request) {
        User user = authService.getCurrentUser();
        GroupOrderResponse response = groupOrderService.addItemToGroupCart(id, user, request);
        return ResponseEntity.ok(ApiResponse.ok("Item added to group cart", response));
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<ApiResponse<GroupOrderResponse>> removeItemFromGroupCart(
            @PathVariable Long id,
            @PathVariable Long itemId) {
        User user = authService.getCurrentUser();
        GroupOrderResponse response = groupOrderService.removeItemFromGroupCart(id, itemId, user);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from group cart", response));
    }

    @PatchMapping("/{id}/delivery-mode")
    public ResponseEntity<ApiResponse<GroupOrderResponse>> updateDeliveryMode(
            @PathVariable Long id,
            @Valid @RequestBody DeliveryModeUpdateRequest request) {
        User user = authService.getCurrentUser();
        GroupOrderResponse response = groupOrderService.updateDeliveryMode(id, request.getDeliveryMode(), user);
        return ResponseEntity.ok(ApiResponse.ok("Delivery mode updated", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupOrderResponse>>> getGroupOrders() {
        User user = authService.getCurrentUser();
        List<GroupOrderResponse> list = groupOrderService.getGroupOrdersForUser(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/{id}/place")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> placeGroupOrder(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        List<OrderResponse> orders = groupOrderService.placeGroupOrder(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Group order finalized and placed", orders));
    }

    @PatchMapping("/{id}/restaurant-action")
    public ResponseEntity<ApiResponse<String>> handleRestaurantAction(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantActionRequest request) {
        User user = authService.getCurrentUser();
        ApiResponse<String> response = groupOrderService.handleRestaurantAction(id, request.getAction(), request.getReason(), user);
        return ResponseEntity.ok(response);
    }
}
