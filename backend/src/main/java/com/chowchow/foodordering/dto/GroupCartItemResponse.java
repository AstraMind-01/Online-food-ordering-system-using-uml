package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.GroupCartItem;

public class GroupCartItemResponse {

    private Long id;
    private Long memberId;
    private String memberName;
    private Long foodItemId;
    private String foodItemName;
    private Double price;
    private Integer quantity;
    private Double subtotal;
    private String imageUrl;

    public GroupCartItemResponse() {
    }

    public GroupCartItemResponse(GroupCartItem item) {
        this.id = item.getId();
        if (item.getMember() != null && item.getMember().getUser() != null) {
            this.memberId = item.getMember().getId();
            this.memberName = item.getMember().getUser().getName();
        }
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

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
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
