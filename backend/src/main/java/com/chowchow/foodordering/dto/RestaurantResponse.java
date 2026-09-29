package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.Restaurant;

public class RestaurantResponse {

    private Long id;
    private Long ownerId;
    private String name;
    private String cuisine;
    private String address;
    private Double rating;
    private boolean open;
    private String imageUrl;
    private Double latitude;
    private Double longitude;

    public RestaurantResponse() {
    }

    public RestaurantResponse(Restaurant restaurant) {
        this.id = restaurant.getId();
        this.ownerId = restaurant.getOwner() != null ? restaurant.getOwner().getId() : null;
        this.name = restaurant.getName();
        this.cuisine = restaurant.getCuisine();
        this.address = restaurant.getAddress();
        this.rating = restaurant.getRating();
        this.open = restaurant.isOpen();
        this.imageUrl = restaurant.getImageUrl();
        this.latitude = restaurant.getLatitude();
        this.longitude = restaurant.getLongitude();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
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
