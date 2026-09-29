package com.chowchow.foodordering.controller;

import com.chowchow.foodordering.dto.ApiResponse;
import com.chowchow.foodordering.dto.FoodItemResponse;
import com.chowchow.foodordering.service.FoodItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final FoodItemService foodItemService;

    public MenuController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodItemResponse>>> getAllMenuItems() {
        List<FoodItemResponse> items = foodItemService.getAllMenuItems();
        return ResponseEntity.ok(ApiResponse.ok(items));
    }
}
