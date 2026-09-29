package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.GroupMember;

import java.time.LocalDateTime;

public class GroupMemberResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private LocalDateTime joinedAt;
    private Integer itemCount = 0;
    private Double subtotal = 0.0;

    public GroupMemberResponse() {
    }

    public GroupMemberResponse(GroupMember member, Integer itemCount, Double subtotal) {
        this.id = member.getId();
        if (member.getUser() != null) {
            this.userId = member.getUser().getId();
            this.userName = member.getUser().getName();
            this.userEmail = member.getUser().getEmail();
        }
        this.joinedAt = member.getJoinedAt();
        this.itemCount = itemCount != null ? itemCount : 0;
        this.subtotal = subtotal != null ? subtotal : 0.0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public Integer getItemCount() {
        return itemCount;
    }

    public void setItemCount(Integer itemCount) {
        this.itemCount = itemCount;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
}
