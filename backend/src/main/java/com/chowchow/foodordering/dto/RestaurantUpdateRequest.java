package com.chowchow.foodordering.dto;

public class RestaurantUpdateRequest {

    private String name;
    private String cuisine;
    private String address;
    private String imageUrl;
    private Boolean open;

    public RestaurantUpdateRequest() {
    }

    public RestaurantUpdateRequest(String name, String cuisine, String address, String imageUrl, Boolean open) {
        this.name = name;
        this.cuisine = cuisine;
        this.address = address;
        this.imageUrl = imageUrl;
        this.open = open;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getOpen() {
        return open;
    }

    public void setOpen(Boolean open) {
        this.open = open;
    }
}
