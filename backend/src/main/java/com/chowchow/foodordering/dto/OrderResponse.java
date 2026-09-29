package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Long restaurantId;
    private String restaurantName;
    private List<OrderItemResponse> items = new ArrayList<>();
    private Double totalAmount;
    private String deliveryAddress;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private DeliveryStatus deliveryStatus;
    private String deliveryPartnerName;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private Double restaurantLatitude;
    private Double restaurantLongitude;

    public OrderResponse() {
    }

    public OrderResponse(Order order, Payment payment, Delivery delivery) {
        this.id = order.getId();
        if (order.getCustomer() != null) {
            this.customerId = order.getCustomer().getId();
            this.customerName = order.getCustomer().getName();
            this.customerEmail = order.getCustomer().getEmail();
        }
        if (order.getRestaurant() != null) {
            this.restaurantId = order.getRestaurant().getId();
            this.restaurantName = order.getRestaurant().getName();
            this.restaurantLatitude = order.getRestaurant().getLatitude();
            this.restaurantLongitude = order.getRestaurant().getLongitude();
        }
        if (order.getItems() != null) {
            this.items = order.getItems().stream().map(OrderItemResponse::new).collect(Collectors.toList());
        }
        this.totalAmount = order.getTotalAmount();
        this.deliveryAddress = order.getDeliveryAddress();
        this.deliveryLatitude = order.getDeliveryLatitude();
        this.deliveryLongitude = order.getDeliveryLongitude();
        this.status = order.getStatus();
        this.createdAt = order.getCreatedAt();

        if (payment != null) {
            this.paymentStatus = payment.getStatus();
            this.paymentMethod = payment.getMethod();
        } else {
            this.paymentStatus = PaymentStatus.PENDING;
        }

        if (delivery != null) {
            this.deliveryStatus = delivery.getStatus();
            if (delivery.getDeliveryPartner() != null) {
                this.deliveryPartnerName = delivery.getDeliveryPartner().getName();
            }
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
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

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getDeliveryPartnerName() {
        return deliveryPartnerName;
    }

    public void setDeliveryPartnerName(String deliveryPartnerName) {
        this.deliveryPartnerName = deliveryPartnerName;
    }
}
