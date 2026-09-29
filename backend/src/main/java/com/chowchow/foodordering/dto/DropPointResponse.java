package com.chowchow.foodordering.dto;

public class DropPointResponse {

    private Long id;
    private String memberName;
    private String memberPhone;
    private String address;
    private String itemsSummary;
    private Double subtotal;
    private boolean delivered;

    public DropPointResponse() {
    }

    public DropPointResponse(Long id, String memberName, String memberPhone, String address, String itemsSummary, Double subtotal, boolean delivered) {
        this.id = id;
        this.memberName = memberName;
        this.memberPhone = memberPhone;
        this.address = address;
        this.itemsSummary = itemsSummary;
        this.subtotal = subtotal;
        this.delivered = delivered;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getMemberPhone() {
        return memberPhone;
    }

    public void setMemberPhone(String memberPhone) {
        this.memberPhone = memberPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getItemsSummary() {
        return itemsSummary;
    }

    public void setItemsSummary(String itemsSummary) {
        this.itemsSummary = itemsSummary;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public boolean isDelivered() {
        return delivered;
    }

    public void setDelivered(boolean delivered) {
        this.delivered = delivered;
    }
}
