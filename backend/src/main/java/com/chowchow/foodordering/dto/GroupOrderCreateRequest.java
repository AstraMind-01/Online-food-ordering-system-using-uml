package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.DeliveryMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GroupOrderCreateRequest {

    @NotBlank(message = "Group name is required")
    private String name;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private DeliveryMode deliveryMode = DeliveryMode.COMMON;

    public GroupOrderCreateRequest() {
    }

    public GroupOrderCreateRequest(String name, Long restaurantId, DeliveryMode deliveryMode) {
        this.name = name;
        this.restaurantId = restaurantId;
        this.deliveryMode = deliveryMode != null ? deliveryMode : DeliveryMode.COMMON;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public DeliveryMode getDeliveryMode() {
        return deliveryMode;
    }

    public void setDeliveryMode(DeliveryMode deliveryMode) {
        this.deliveryMode = deliveryMode;
    }
}
