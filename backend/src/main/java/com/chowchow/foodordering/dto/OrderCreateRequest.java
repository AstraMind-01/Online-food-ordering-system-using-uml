package com.chowchow.foodordering.dto;

import jakarta.validation.constraints.NotBlank;

public class OrderCreateRequest {

    private Long restaurantId;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    private Double deliveryLatitude;

    private Double deliveryLongitude;

    public OrderCreateRequest() {
    }

    public OrderCreateRequest(Long restaurantId, String deliveryAddress) {
        this.restaurantId = restaurantId;
        this.deliveryAddress = deliveryAddress;
    }

    public OrderCreateRequest(Long restaurantId, String deliveryAddress, Double deliveryLatitude, Double deliveryLongitude) {
        this.restaurantId = restaurantId;
        this.deliveryAddress = deliveryAddress;
        this.deliveryLatitude = deliveryLatitude;
        this.deliveryLongitude = deliveryLongitude;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public Double getDeliveryLatitude() {
        return deliveryLatitude;
    }

    public void setDeliveryLatitude(Double deliveryLatitude) {
        this.deliveryLatitude = deliveryLatitude;
    }

    public Double getDeliveryLongitude() {
        return deliveryLongitude;
    }

    public void setDeliveryLongitude(Double deliveryLongitude) {
        this.deliveryLongitude = deliveryLongitude;
    }
}

