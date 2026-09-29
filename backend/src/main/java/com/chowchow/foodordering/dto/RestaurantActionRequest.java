package com.chowchow.foodordering.dto;

import jakarta.validation.constraints.NotBlank;

public class RestaurantActionRequest {

    @NotBlank(message = "Action is required (ACCEPT or REJECT)")
    private String action; // ACCEPT or REJECT

    private String reason;

    public RestaurantActionRequest() {
    }

    public RestaurantActionRequest(String action) {
        this.action = action;
    }

    public RestaurantActionRequest(String action, String reason) {
        this.action = action;
        this.reason = reason;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
