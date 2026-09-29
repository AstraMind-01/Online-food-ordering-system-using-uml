package com.chowchow.foodordering.service;

import com.chowchow.foodordering.dto.RestaurantResponse;
import com.chowchow.foodordering.dto.RestaurantUpdateRequest;
import com.chowchow.foodordering.entity.Restaurant;
import com.chowchow.foodordering.entity.Role;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.exception.ResourceNotFoundException;
import com.chowchow.foodordering.exception.UnauthorizedException;
import com.chowchow.foodordering.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @Transactional(readOnly = true)
    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(RestaurantResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return new RestaurantResponse(restaurant);
    }

    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantByOwner(User owner) {
        Restaurant restaurant = restaurantRepository.findByOwnerId(owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No restaurant registered for current user"));
        return new RestaurantResponse(restaurant);
    }

    @Transactional
    public RestaurantResponse updateRestaurant(Long id, RestaurantUpdateRequest request, User owner) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

        if (owner.getRole() != Role.ADMIN && (restaurant.getOwner() == null || !restaurant.getOwner().getId().equals(owner.getId()))) {
            throw new UnauthorizedException("You are not authorized to update this restaurant");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            restaurant.setName(request.getName());
        }
        if (request.getCuisine() != null) {
            restaurant.setCuisine(request.getCuisine());
        }
        if (request.getAddress() != null) {
            restaurant.setAddress(request.getAddress());
        }
        if (request.getImageUrl() != null) {
            restaurant.setImageUrl(request.getImageUrl());
        }
        if (request.getOpen() != null) {
            restaurant.setOpen(request.getOpen());
        }

        return new RestaurantResponse(restaurantRepository.save(restaurant));
    }

    @Transactional
    public RestaurantResponse toggleOpenStatus(Long id, User owner) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

        if (owner.getRole() != Role.ADMIN && (restaurant.getOwner() == null || !restaurant.getOwner().getId().equals(owner.getId()))) {
            throw new UnauthorizedException("You are not authorized to update this restaurant");
        }

        restaurant.setOpen(!restaurant.isOpen());
        return new RestaurantResponse(restaurantRepository.save(restaurant));
    }

    public Restaurant getEntityById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }
}
