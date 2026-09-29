package com.chowchow.foodordering.dto;

public class UserProfileUpdateRequest {

    private String name;
    private String phone;
    private String address;
    private String vehicleType;
    private String vehicleNumber;
    private Boolean online;

    public UserProfileUpdateRequest() {
    }

    public UserProfileUpdateRequest(String name, String phone, String address, String vehicleType, String vehicleNumber, Boolean online) {
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.vehicleType = vehicleType;
        this.vehicleNumber = vehicleNumber;
        this.online = online;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public Boolean getOnline() {
        return online;
    }

    public void setOnline(Boolean online) {
        this.online = online;
    }
}
