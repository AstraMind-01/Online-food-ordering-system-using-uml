package com.chowchow.foodordering.dto;

import jakarta.validation.constraints.NotBlank;

public class GroupOrderJoinRequest {

    @NotBlank(message = "Group code is required")
    private String groupCode;

    public GroupOrderJoinRequest() {
    }

    public GroupOrderJoinRequest(String groupCode) {
        this.groupCode = groupCode;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }
}
