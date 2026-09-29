package com.chowchow.foodordering.dto;

import java.util.ArrayList;
import java.util.List;

public class CartResponse {

    private Long id;
    private List<CartItemResponse> items = new ArrayList<>();
    private Double totalAmount = 0.0;
    private Integer itemCount = 0;

    public CartResponse() {
    }

    public CartResponse(Long id, List<CartItemResponse> items) {
        this.id = id;
        this.items = items != null ? items : new ArrayList<>();
        this.totalAmount = this.items.stream().mapToDouble(CartItemResponse::getSubtotal).sum();
        this.itemCount = this.items.stream().mapToInt(CartItemResponse::getQuantity).sum();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
        this.totalAmount = this.items.stream().mapToDouble(CartItemResponse::getSubtotal).sum();
        this.itemCount = this.items.stream().mapToInt(CartItemResponse::getQuantity).sum();
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getItemCount() {
        return itemCount;
    }

    public void setItemCount(Integer itemCount) {
        this.itemCount = itemCount;
    }
}
