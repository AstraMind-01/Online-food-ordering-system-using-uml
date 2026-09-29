package com.chowchow.foodordering.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_locations")
public class DeliveryLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_id", nullable = false)
    private Delivery delivery;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private Double heading = 0.0;

    private Double speed = 0.0;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public DeliveryLocation() {
    }

    public DeliveryLocation(Delivery delivery, Double latitude, Double longitude, Double heading, Double speed) {
        this.delivery = delivery;
        this.latitude = latitude;
        this.longitude = longitude;
        this.heading = heading != null ? heading : 0.0;
        this.speed = speed != null ? speed : 0.0;
        this.timestamp = LocalDateTime.now();
    }

    public DeliveryLocation(Delivery delivery, Double latitude, Double longitude, Double heading, Double speed, LocalDateTime timestamp) {
        this.delivery = delivery;
        this.latitude = latitude;
        this.longitude = longitude;
        this.heading = heading != null ? heading : 0.0;
        this.speed = speed != null ? speed : 0.0;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Delivery getDelivery() {
        return delivery;
    }

    public void setDelivery(Delivery delivery) {
        this.delivery = delivery;
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
