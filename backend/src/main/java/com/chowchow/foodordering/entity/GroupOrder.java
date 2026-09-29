package com.chowchow.foodordering.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "group_orders")
public class GroupOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String groupCode;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GroupOrderStatus status = GroupOrderStatus.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryMode deliveryMode = DeliveryMode.COMMON;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "groupOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "groupOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupCartItem> items = new ArrayList<>();

    public GroupOrder() {
    }

    public GroupOrder(String groupCode, String name, User organizer, Restaurant restaurant, DeliveryMode deliveryMode) {
        this.groupCode = groupCode;
        this.name = name;
        this.organizer = organizer;
        this.restaurant = restaurant;
        this.deliveryMode = deliveryMode != null ? deliveryMode : DeliveryMode.COMMON;
        this.status = GroupOrderStatus.OPEN;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public GroupOrderStatus getStatus() {
        return status;
    }

    public void setStatus(GroupOrderStatus status) {
        this.status = status;
    }

    public DeliveryMode getDeliveryMode() {
        return deliveryMode;
    }

    public void setDeliveryMode(DeliveryMode deliveryMode) {
        this.deliveryMode = deliveryMode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<GroupMember> getMembers() {
        return members;
    }

    public void setMembers(List<GroupMember> members) {
        this.members = members;
    }

    public List<GroupCartItem> getItems() {
        return items;
    }

    public void setItems(List<GroupCartItem> items) {
        this.items = items;
    }

    public void addMember(GroupMember member) {
        members.add(member);
        member.setGroupOrder(this);
    }

    public void addItem(GroupCartItem item) {
        items.add(item);
        item.setGroupOrder(this);
    }

    public void removeItem(GroupCartItem item) {
        items.remove(item);
        item.setGroupOrder(null);
    }
}
