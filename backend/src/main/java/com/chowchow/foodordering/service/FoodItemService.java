package com.chowchow.foodordering.service;

import com.chowchow.foodordering.dto.FoodItemRequest;
import com.chowchow.foodordering.dto.FoodItemResponse;
import com.chowchow.foodordering.entity.FoodItem;
import com.chowchow.foodordering.entity.Restaurant;
import com.chowchow.foodordering.entity.Role;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.exception.BadRequestException;
import com.chowchow.foodordering.exception.ResourceNotFoundException;
import com.chowchow.foodordering.exception.UnauthorizedException;
import com.chowchow.foodordering.repository.FoodItemRepository;
import com.chowchow.foodordering.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;
    private final RestaurantRepository restaurantRepository;

    public FoodItemService(FoodItemRepository foodItemRepository, RestaurantRepository restaurantRepository) {
        this.foodItemRepository = foodItemRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @Transactional(readOnly = true)
    public List<FoodItemResponse> getAllMenuItems() {
        return foodItemRepository.findAll().stream()
                .map(FoodItemResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodItemResponse> getMenuByRestaurantId(Long restaurantId) {
        return foodItemRepository.findByRestaurantId(restaurantId).stream()
                .map(FoodItemResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public FoodItemResponse addFoodItem(Long restaurantId, FoodItemRequest request, User currentUser) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));

        verifyRestaurantAccess(restaurant, currentUser);

        FoodItem item = new FoodItem(
                restaurant,
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getImageUrl(),
                request.getCategory(),
                request.getBadgeText(),
                request.getPrepTimeMins(),
                request.getAvailable() != null ? request.getAvailable() : true
        );

        FoodItem saved = foodItemRepository.save(item);
        return new FoodItemResponse(saved);
    }

    @Transactional
    public FoodItemResponse updateFoodItem(Long restaurantId, Long itemId, FoodItemRequest request, User currentUser) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));

        verifyRestaurantAccess(restaurant, currentUser);

        FoodItem item = foodItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + itemId));

        if (!item.getRestaurant().getId().equals(restaurantId)) {
            throw new BadRequestException("Item does not belong to specified restaurant");
        }

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setCategory(request.getCategory());
        item.setBadgeText(request.getBadgeText());
        item.setPrepTimeMins(request.getPrepTimeMins());
        if (request.getAvailable() != null) {
            item.setAvailable(request.getAvailable());
        }

        FoodItem updated = foodItemRepository.save(item);
        return new FoodItemResponse(updated);
    }

    @Transactional
    public void deleteFoodItem(Long restaurantId, Long itemId, User currentUser) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));

        verifyRestaurantAccess(restaurant, currentUser);

        FoodItem item = foodItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + itemId));

        foodItemRepository.delete(item);
    }

    @Transactional
    public FoodItemResponse toggleAvailability(Long restaurantId, Long itemId, User currentUser) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));

        verifyRestaurantAccess(restaurant, currentUser);

        FoodItem item = foodItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + itemId));

        item.setAvailable(!item.isAvailable());
        FoodItem updated = foodItemRepository.save(item);
        return new FoodItemResponse(updated);
    }

    private void verifyRestaurantAccess(Restaurant restaurant, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }
        if (currentUser.getRole() == Role.RESTAURANT && restaurant.getOwner() != null
                && restaurant.getOwner().getId().equals(currentUser.getId())) {
            return;
        }
        throw new UnauthorizedException("You do not have permission to modify this restaurant's menu");
    }
}
