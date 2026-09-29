package com.chowchow.foodordering.controller;

import com.chowchow.foodordering.dto.ApiResponse;
import com.chowchow.foodordering.dto.FoodItemRequest;
import com.chowchow.foodordering.dto.FoodItemResponse;
import com.chowchow.foodordering.dto.RestaurantResponse;
import com.chowchow.foodordering.dto.RestaurantUpdateRequest;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.service.AuthService;
import com.chowchow.foodordering.service.FoodItemService;
import com.chowchow.foodordering.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final FoodItemService foodItemService;
    private final AuthService authService;

    public RestaurantController(RestaurantService restaurantService,
                                FoodItemService foodItemService,
                                AuthService authService) {
        this.restaurantService = restaurantService;
        this.foodItemService = foodItemService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getAllRestaurants() {
        List<RestaurantResponse> list = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('RESTAURANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getMyRestaurant() {
        User user = authService.getCurrentUser();
        RestaurantResponse response = restaurantService.getRestaurantByOwner(user);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantById(@PathVariable Long id) {
        RestaurantResponse response = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurant(
            @PathVariable Long id,
            @RequestBody RestaurantUpdateRequest request) {
        User user = authService.getCurrentUser();
        RestaurantResponse response = restaurantService.updateRestaurant(id, request, user);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant updated successfully", response));
    }

    @PatchMapping("/{id}/toggle-open")
    @PreAuthorize("hasAnyRole('RESTAURANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> toggleOpenStatus(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        RestaurantResponse response = restaurantService.toggleOpenStatus(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant open status toggled", response));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<ApiResponse<List<FoodItemResponse>>> getMenuByRestaurant(@PathVariable Long id) {
        List<FoodItemResponse> menu = foodItemService.getMenuByRestaurantId(id);
        return ResponseEntity.ok(ApiResponse.ok(menu));
    }

    @PostMapping("/{id}/menu")
    @PreAuthorize("hasAnyRole('RESTAURANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<FoodItemResponse>> addFoodItem(
            @PathVariable Long id,
            @Valid @RequestBody FoodItemRequest request) {
        User user = authService.getCurrentUser();
        FoodItemResponse item = foodItemService.addFoodItem(id, request, user);
        return ResponseEntity.ok(ApiResponse.ok("Menu item created", item));
    }

    @PutMapping("/{id}/menu/{itemId}")
    @PreAuthorize("hasAnyRole('RESTAURANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<FoodItemResponse>> updateFoodItem(
            @PathVariable Long id,
            @PathVariable Long itemId,
            @Valid @RequestBody FoodItemRequest request) {
        User user = authService.getCurrentUser();
        FoodItemResponse item = foodItemService.updateFoodItem(id, itemId, request, user);
        return ResponseEntity.ok(ApiResponse.ok("Menu item updated", item));
    }

    @DeleteMapping("/{id}/menu/{itemId}")
    @PreAuthorize("hasAnyRole('RESTAURANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteFoodItem(
            @PathVariable Long id,
            @PathVariable Long itemId) {
        User user = authService.getCurrentUser();
        foodItemService.deleteFoodItem(id, itemId, user);
        return ResponseEntity.ok(ApiResponse.ok("Menu item deleted successfully", null));
    }

    @PatchMapping("/{id}/menu/{itemId}/availability")
    @PreAuthorize("hasAnyRole('RESTAURANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<FoodItemResponse>> toggleAvailability(
            @PathVariable Long id,
            @PathVariable Long itemId) {
        User user = authService.getCurrentUser();
        FoodItemResponse item = foodItemService.toggleAvailability(id, itemId, user);
        return ResponseEntity.ok(ApiResponse.ok("Availability updated", item));
    }
}
