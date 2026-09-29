package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.DeliveryMode;
import com.chowchow.foodordering.entity.GroupOrder;
import com.chowchow.foodordering.entity.GroupOrderStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class GroupOrderResponse {

    private Long id;
    private String groupCode;
    private String name;
    private Long organizerId;
    private String organizerName;
    private String organizerEmail;
    private Long restaurantId;
    private String restaurantName;
    private GroupOrderStatus status;
    private DeliveryMode deliveryMode;
    private LocalDateTime createdAt;
    private List<GroupMemberResponse> members = new ArrayList<>();
    private List<GroupCartItemResponse> items = new ArrayList<>();
    private Double totalAmount = 0.0;
    private Integer totalItems = 0;

    public GroupOrderResponse() {
    }

    public GroupOrderResponse(GroupOrder groupOrder, List<GroupMemberResponse> members, List<GroupCartItemResponse> items) {
        this.id = groupOrder.getId();
        this.groupCode = groupOrder.getGroupCode();
        this.name = groupOrder.getName();
        if (groupOrder.getOrganizer() != null) {
            this.organizerId = groupOrder.getOrganizer().getId();
            this.organizerName = groupOrder.getOrganizer().getName();
            this.organizerEmail = groupOrder.getOrganizer().getEmail();
        }
        if (groupOrder.getRestaurant() != null) {
            this.restaurantId = groupOrder.getRestaurant().getId();
            this.restaurantName = groupOrder.getRestaurant().getName();
        }
        this.status = groupOrder.getStatus();
        this.deliveryMode = groupOrder.getDeliveryMode();
        this.createdAt = groupOrder.getCreatedAt();
        this.members = members != null ? members : new ArrayList<>();
        this.items = items != null ? items : new ArrayList<>();
        this.totalAmount = this.items.stream().mapToDouble(GroupCartItemResponse::getSubtotal).sum();
        this.totalItems = this.items.stream().mapToInt(GroupCartItemResponse::getQuantity).sum();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public String getOrganizerEmail() {
        return organizerEmail;
    }

    public void setOrganizerEmail(String organizerEmail) {
        this.organizerEmail = organizerEmail;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public GroupOrderStatus getStatus() {
        return status;
    }

    public void setStatus(GroupOrderStatus status) {
        this.status = status;
    }

    public DeliveryMode getDeliveryMode() {
        return deliveryMode;
    }

    public void setDeliveryMode(DeliveryMode deliveryMode) {
        this.deliveryMode = deliveryMode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<GroupMemberResponse> getMembers() {
        return members;
    }

    public void setMembers(List<GroupMemberResponse> members) {
        this.members = members;
    }

    public List<GroupCartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<GroupCartItemResponse> items) {
        this.items = items;
        this.totalAmount = this.items.stream().mapToDouble(GroupCartItemResponse::getSubtotal).sum();
        this.totalItems = this.items.stream().mapToInt(GroupCartItemResponse::getQuantity).sum();
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }
}
