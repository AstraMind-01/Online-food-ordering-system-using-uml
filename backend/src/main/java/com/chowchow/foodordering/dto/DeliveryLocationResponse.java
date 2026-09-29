package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.DeliveryLocation;
import java.time.LocalDateTime;

public class DeliveryLocationResponse {

    private Long id;
    private Long deliveryId;
    private Long orderId;
    private Double latitude;
    private Double longitude;
    private Double heading;
    private Double speed;
    private LocalDateTime timestamp;

    public DeliveryLocationResponse() {
    }

    public DeliveryLocationResponse(DeliveryLocation location) {
        if (location != null) {
            this.id = location.getId();
            if (location.getDelivery() != null) {
                this.deliveryId = location.getDelivery().getId();
                if (location.getDelivery().getOrder() != null) {
                    this.orderId = location.getDelivery().getOrder().getId();
                }
            }
            this.latitude = location.getLatitude();
            this.longitude = location.getLongitude();
            this.heading = location.getHeading();
            this.speed = location.getSpeed();
            this.timestamp = location.getTimestamp();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(Long deliveryId) {
        this.deliveryId = deliveryId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getHeading() {
        return heading;
    }

    public void setHeading(Double heading) {
        this.heading = heading;
    }

    public Double getSpeed() {
        return speed;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
