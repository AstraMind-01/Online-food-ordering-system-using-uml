package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.OrderItem;

public class OrderItemResponse {

    private Long id;
    private Long foodItemId;
    private String foodItemName;
    private Double price;
    private Integer quantity;
    private Double subtotal;
    private String imageUrl;

    public OrderItemResponse() {
    }

    public OrderItemResponse(OrderItem item) {
        this.id = item.getId();
        if (item.getFoodItem() != null) {
            this.foodItemId = item.getFoodItem().getId();
            this.foodItemName = item.getFoodItem().getName();
            this.imageUrl = item.getFoodItem().getImageUrl();
        }
        this.price = item.getPrice();
        this.quantity = item.getQuantity();
        this.subtotal = item.getPrice() * item.getQuantity();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFoodItemId() {
        return foodItemId;
    }

    public void setFoodItemId(Long foodItemId) {
        this.foodItemId = foodItemId;
    }

    public String getFoodItemName() {
        return foodItemName;
    }

    public void setFoodItemName(String foodItemName) {
        this.foodItemName = foodItemName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
