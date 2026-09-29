package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.DeliveryMode;
import jakarta.validation.constraints.NotNull;

public class DeliveryModeUpdateRequest {

    @NotNull(message = "Delivery mode is required")
    private DeliveryMode deliveryMode;

    public DeliveryModeUpdateRequest() {
    }

    public DeliveryModeUpdateRequest(DeliveryMode deliveryMode) {
        this.deliveryMode = deliveryMode;
    }

    public DeliveryMode getDeliveryMode() {
        return deliveryMode;
    }

    public void setDeliveryMode(DeliveryMode deliveryMode) {
        this.deliveryMode = deliveryMode;
    }
}
