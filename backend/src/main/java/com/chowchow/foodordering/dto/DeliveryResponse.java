package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.Delivery;
import com.chowchow.foodordering.entity.DeliveryStatus;
import com.chowchow.foodordering.entity.Order;
import com.chowchow.foodordering.entity.OrderItem;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class DeliveryResponse {

    private Long id;
    private Long orderId;
    private String orderNumber;
    private Long deliveryPartnerId;
    private String deliveryPartnerName;
    private String deliveryPartnerPhone;
    private String restaurantName;
    private String restaurantAddress;
    private String customerName;
    private String customerPhone;
    private String deliveryAddress;
    private Double orderTotal;
    private DeliveryStatus status;
    private String paymentStatus = "PAID";
    private String deliveryType = "SINGLE"; // SINGLE, GROUP_COMMON, GROUP_INDIVIDUAL
    private String groupCode;
    private List<OrderItemResponse> items = new ArrayList<>();
    private Integer itemCount = 0;
    private List<DropPointResponse> groupDrops = new ArrayList<>();
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    public DeliveryResponse() {
    }

    public DeliveryResponse(Delivery delivery) {
        this.id = delivery.getId();
        this.status = delivery.getStatus();
        this.pickedUpAt = delivery.getPickedUpAt();
        this.deliveredAt = delivery.getDeliveredAt();

        if (delivery.getDeliveryPartner() != null) {
            this.deliveryPartnerId = delivery.getDeliveryPartner().getId();
            this.deliveryPartnerName = delivery.getDeliveryPartner().getName();
            this.deliveryPartnerPhone = delivery.getDeliveryPartner().getPhone();
        }

        Order order = delivery.getOrder();
        if (order != null) {
            populateOrderDetails(order);
        }
    }

    public DeliveryResponse(Order order) {
        // Constructor for available orders that don't have a Delivery entity yet
        this.id = order.getId();
        this.orderId = order.getId();
        this.status = DeliveryStatus.ASSIGNED;
        populateOrderDetails(order);
    }

    private void populateOrderDetails(Order order) {
        this.orderId = order.getId();
        this.orderNumber = "ORD-" + String.format("%04d", order.getId());
        this.deliveryAddress = order.getDeliveryAddress();
        this.orderTotal = order.getTotalAmount();

        if (order.getRestaurant() != null) {
            this.restaurantName = order.getRestaurant().getName();
            this.restaurantAddress = order.getRestaurant().getAddress();
        }

        if (order.getCustomer() != null) {
            this.customerName = order.getCustomer().getName();
            this.customerPhone = order.getCustomer().getPhone() != null ? order.getCustomer().getPhone() : "555-0199";
        }

        if (order.getItems() != null && !order.getItems().isEmpty()) {
            this.items = order.getItems().stream().map(OrderItemResponse::new).collect(Collectors.toList());
            this.itemCount = order.getItems().stream().mapToInt(OrderItem::getQuantity).sum();
        }

        // Check if deliveryAddress indicates a group booth or special drop
        if (order.getDeliveryAddress() != null && order.getDeliveryAddress().toLowerCase().contains("booth")) {
            this.deliveryType = "GROUP_COMMON";
            this.groupCode = "BOOTH-GRP";
        } else if (order.getDeliveryAddress() != null && order.getDeliveryAddress().toLowerCase().contains("split")) {
            this.deliveryType = "GROUP_INDIVIDUAL";
            this.groupCode = "BOOTH-IND";
            // Populate sample drops
            this.groupDrops.add(new DropPointResponse(1L, order.getCustomer() != null ? order.getCustomer().getName() : "Member 1", "555-0102", order.getDeliveryAddress(), "2x Route 66 Burger", order.getTotalAmount() * 0.6, this.status == DeliveryStatus.DELIVERED));
            this.groupDrops.add(new DropPointResponse(2L, "Johnny Nitro", "555-0103", "12 Vintage Blvd, Springfield", "1x Chili Cheese Fries", order.getTotalAmount() * 0.4, this.status == DeliveryStatus.DELIVERED));
        } else {
            this.deliveryType = "SINGLE";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public Long getDeliveryPartnerId() {
        return deliveryPartnerId;
    }

    public void setDeliveryPartnerId(Long deliveryPartnerId) {
        this.deliveryPartnerId = deliveryPartnerId;
    }

    public String getDeliveryPartnerName() {
        return deliveryPartnerName;
    }

    public void setDeliveryPartnerName(String deliveryPartnerName) {
        this.deliveryPartnerName = deliveryPartnerName;
    }

    public String getDeliveryPartnerPhone() {
        return deliveryPartnerPhone;
    }

    public void setDeliveryPartnerPhone(String deliveryPartnerPhone) {
        this.deliveryPartnerPhone = deliveryPartnerPhone;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getRestaurantAddress() {
        return restaurantAddress;
    }

    public void setRestaurantAddress(String restaurantAddress) {
        this.restaurantAddress = restaurantAddress;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public Double getOrderTotal() {
        return orderTotal;
    }

    public void setOrderTotal(Double orderTotal) {
        this.orderTotal = orderTotal;
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryStatus status) {
        this.status = status;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getDeliveryType() {
        return deliveryType;
    }

    public void setDeliveryType(String deliveryType) {
        this.deliveryType = deliveryType;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public Integer getItemCount() {
        return itemCount;
    }

    public void setItemCount(Integer itemCount) {
        this.itemCount = itemCount;
    }

    public List<DropPointResponse> getGroupDrops() {
        return groupDrops;
    }

    public void setGroupDrops(List<DropPointResponse> groupDrops) {
        this.groupDrops = groupDrops;
    }

    public LocalDateTime getPickedUpAt() {
        return pickedUpAt;
    }

    public void setPickedUpAt(LocalDateTime pickedUpAt) {
        this.pickedUpAt = pickedUpAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
}
