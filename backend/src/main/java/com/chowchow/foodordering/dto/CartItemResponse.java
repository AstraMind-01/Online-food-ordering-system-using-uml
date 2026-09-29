package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.CartItem;

public class CartItemResponse {

    private Long id;
    private Long foodItemId;
    private String foodItemName;
    private Double price;
    private String imageUrl;
    private Integer quantity;
    private Double subtotal;

    public CartItemResponse() {
    }

    public CartItemResponse(CartItem item) {
        this.id = item.getId();
        if (item.getFoodItem() != null) {
            this.foodItemId = item.getFoodItem().getId();
            this.foodItemName = item.getFoodItem().getName();
            this.price = item.getFoodItem().getPrice();
            this.imageUrl = item.getFoodItem().getImageUrl();
            this.quantity = item.getQuantity();
            this.subtotal = item.getFoodItem().getPrice() * item.getQuantity();
        }
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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
}
