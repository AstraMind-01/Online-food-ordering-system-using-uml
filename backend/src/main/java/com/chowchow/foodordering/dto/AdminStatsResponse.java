package com.chowchow.foodordering.dto;

public class AdminStatsResponse {

    private long totalUsers;
    private long totalCustomers;
    private long totalRestaurants;
    private long totalDeliveryPartners;
    private long totalOrders;
    private double totalRevenue;
    private long activeOrders;
    private long activeDeliveries;
    private long totalGroupOrders;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalUsers, long totalCustomers, long totalRestaurants,
                              long totalDeliveryPartners, long totalOrders, double totalRevenue,
                              long activeOrders, long activeDeliveries, long totalGroupOrders) {
        this.totalUsers = totalUsers;
        this.totalCustomers = totalCustomers;
        this.totalRestaurants = totalRestaurants;
        this.totalDeliveryPartners = totalDeliveryPartners;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.activeOrders = activeOrders;
        this.activeDeliveries = activeDeliveries;
        this.totalGroupOrders = totalGroupOrders;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalRestaurants() {
        return totalRestaurants;
    }

    public void setTotalRestaurants(long totalRestaurants) {
        this.totalRestaurants = totalRestaurants;
    }

    public long getTotalDeliveryPartners() {
        return totalDeliveryPartners;
    }

    public void setTotalDeliveryPartners(long totalDeliveryPartners) {
        this.totalDeliveryPartners = totalDeliveryPartners;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getActiveOrders() {
        return activeOrders;
    }

    public void setActiveOrders(long activeOrders) {
        this.activeOrders = activeOrders;
    }

    public long getActiveDeliveries() {
        return activeDeliveries;
    }

    public void setActiveDeliveries(long activeDeliveries) {
        this.activeDeliveries = activeDeliveries;
    }

    public long getTotalGroupOrders() {
        return totalGroupOrders;
    }

    public void setTotalGroupOrders(long totalGroupOrders) {
        this.totalGroupOrders = totalGroupOrders;
    }
}
