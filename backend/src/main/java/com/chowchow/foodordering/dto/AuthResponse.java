package com.chowchow.foodordering.dto;

import com.chowchow.foodordering.entity.Role;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Role role;
    private UserResponse user;

    public AuthResponse() {
    }

    public AuthResponse(String token, Role role, UserResponse user) {
        this.token = token;
        this.role = role;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}
