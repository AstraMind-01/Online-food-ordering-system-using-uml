package com.chowchow.foodordering.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurants")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String name;

    private String cuisine;

    private String address;

    private Double rating = 4.9;

    @Column(name = "is_open", nullable = false)
    private boolean open = true;

    @Column(length = 1000)
    private String imageUrl;

    private Double latitude = 30.2672;

    private Double longitude = -97.7431;

    public Restaurant() {
    }

    public Restaurant(User owner, String name, String cuisine, String address, Double rating, boolean open, String imageUrl) {
        this.owner = owner;
        this.name = name;
        this.cuisine = cuisine;
        this.address = address;
        this.rating = rating;
        this.open = open;
        this.imageUrl = imageUrl;
        this.latitude = 30.2672;
        this.longitude = -97.7431;
    }

    public Restaurant(User owner, String name, String cuisine, String address, Double rating, boolean open, String imageUrl, Double latitude, Double longitude) {
        this.owner = owner;
        this.name = name;
        this.cuisine = cuisine;
        this.address = address;
        this.rating = rating;
        this.open = open;
        this.imageUrl = imageUrl;
        this.latitude = latitude != null ? latitude : 30.2672;
        this.longitude = longitude != null ? longitude : -97.7431;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public boolean isOpen() {
        return open;
    }

    public void setOpen(boolean open) {
        this.open = open;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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
}
