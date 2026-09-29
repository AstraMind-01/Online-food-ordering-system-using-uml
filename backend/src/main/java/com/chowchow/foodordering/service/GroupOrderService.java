package com.chowchow.foodordering.service;

import com.chowchow.foodordering.dto.*;
import com.chowchow.foodordering.entity.*;
import com.chowchow.foodordering.exception.BadRequestException;
import com.chowchow.foodordering.exception.ResourceNotFoundException;
import com.chowchow.foodordering.exception.UnauthorizedException;
import com.chowchow.foodordering.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GroupOrderService {

    private final GroupOrderRepository groupOrderRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupCartItemRepository groupCartItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final SecureRandom random = new SecureRandom();

    public GroupOrderService(GroupOrderRepository groupOrderRepository,
                             GroupMemberRepository groupMemberRepository,
                             GroupCartItemRepository groupCartItemRepository,
                             RestaurantRepository restaurantRepository,
                             FoodItemRepository foodItemRepository,
                             OrderRepository orderRepository,
                             PaymentRepository paymentRepository) {
        this.groupOrderRepository = groupOrderRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.groupCartItemRepository = groupCartItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.foodItemRepository = foodItemRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public GroupOrderResponse createGroupOrder(User organizer, GroupOrderCreateRequest request) {
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + request.getRestaurantId()));

        String groupCode = generateUniqueGroupCode();

        GroupOrder groupOrder = new GroupOrder(
                groupCode,
                request.getName(),
                organizer,
                restaurant,
                request.getDeliveryMode() != null ? request.getDeliveryMode() : DeliveryMode.COMMON
        );

        GroupOrder savedGroup = groupOrderRepository.save(groupOrder);

        // Add organizer as the first group member
        GroupMember member = new GroupMember(savedGroup, organizer);
        groupMemberRepository.save(member);
        savedGroup.addMember(member);

        return mapToResponse(savedGroup);
    }

    @Transactional
    public GroupOrderResponse joinGroupOrder(User user, GroupOrderJoinRequest request) {
        GroupOrder groupOrder = groupOrderRepository.findByGroupCode(request.getGroupCode().toUpperCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Group order not found with code: " + request.getGroupCode()));

        if (groupOrder.getStatus() != GroupOrderStatus.OPEN) {
            throw new BadRequestException("Group order is no longer accepting new members (Status: " + groupOrder.getStatus() + ")");
        }

        boolean alreadyMember = groupMemberRepository.existsByGroupOrderIdAndUserId(groupOrder.getId(), user.getId());
        if (!alreadyMember) {
            GroupMember newMember = new GroupMember(groupOrder, user);
            groupMemberRepository.save(newMember);
            groupOrder.addMember(newMember);
        }

        return mapToResponse(groupOrder);
    }

    @Transactional(readOnly = true)
    public GroupOrderResponse getGroupOrderById(Long id, User currentUser) {
        GroupOrder groupOrder = groupOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group order not found with id: " + id));

        validateMemberAccess(groupOrder, currentUser);
        return mapToResponse(groupOrder);
    }

    @Transactional(readOnly = true)
    public GroupOrderResponse getGroupOrderByCode(String groupCode, User currentUser) {
        GroupOrder groupOrder = groupOrderRepository.findByGroupCode(groupCode.toUpperCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Group order not found with code: " + groupCode));

        return mapToResponse(groupOrder);
    }

    @Transactional
    public GroupOrderResponse addItemToGroupCart(Long groupOrderId, User user, GroupCartItemRequest request) {
        GroupOrder groupOrder = groupOrderRepository.findById(groupOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Group order not found with id: " + groupOrderId));

        if (groupOrder.getStatus() != GroupOrderStatus.OPEN) {
            throw new BadRequestException("Cannot add items to a finalized or placed group order");
        }

        GroupMember member = groupMemberRepository.findByGroupOrderIdAndUserId(groupOrderId, user.getId())
                .orElseThrow(() -> new UnauthorizedException("You must join this group before adding items"));

        FoodItem foodItem = foodItemRepository.findById(request.getFoodItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + request.getFoodItemId()));

        if (!foodItem.isAvailable()) {
            throw new BadRequestException("Item '" + foodItem.getName() + "' is currently unavailable");
        }

        Optional<GroupCartItem> existingItemOpt = groupCartItemRepository
                .findByGroupOrderIdAndMemberIdAndFoodItemId(groupOrderId, member.getId(), foodItem.getId());

        if (existingItemOpt.isPresent()) {
            GroupCartItem existing = existingItemOpt.get();
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
            groupCartItemRepository.save(existing);
        } else {
            GroupCartItem newItem = new GroupCartItem(groupOrder, member, foodItem, request.getQuantity());
            groupCartItemRepository.save(newItem);
            groupOrder.addItem(newItem);
        }

        return mapToResponse(groupOrder);
    }

    @Transactional
    public GroupOrderResponse removeItemFromGroupCart(Long groupOrderId, Long itemId, User user) {
        GroupOrder groupOrder = groupOrderRepository.findById(groupOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Group order not found with id: " + groupOrderId));

        if (groupOrder.getStatus() != GroupOrderStatus.OPEN) {
            throw new BadRequestException("Cannot remove items from a finalized or placed group order");
        }

        GroupCartItem item = groupCartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Group cart item not found with id: " + itemId));

        boolean isItemOwner = item.getMember().getUser().getId().equals(user.getId());
        boolean isOrganizer = groupOrder.getOrganizer().getId().equals(user.getId());

        if (!isItemOwner && !isOrganizer && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only remove your own items from the group cart");
        }

        groupOrder.removeItem(item);
        groupCartItemRepository.delete(item);

        return mapToResponse(groupOrder);
    }

    @Transactional
    public GroupOrderResponse updateDeliveryMode(Long groupOrderId, DeliveryMode mode, User user) {
        GroupOrder groupOrder = groupOrderRepository.findById(groupOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Group order not found with id: " + groupOrderId));

        if (!groupOrder.getOrganizer().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only the group organizer can change the delivery mode");
        }

        if (groupOrder.getStatus() != GroupOrderStatus.OPEN) {
            throw new BadRequestException("Cannot change delivery mode on finalized group order");
        }

        groupOrder.setDeliveryMode(mode);
        GroupOrder saved = groupOrderRepository.save(groupOrder);
        return mapToResponse(saved);
    }

    @Transactional
    public List<OrderResponse> placeGroupOrder(Long groupOrderId, User user) {
        GroupOrder groupOrder = groupOrderRepository.findById(groupOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Group order not found with id: " + groupOrderId));

        if (!groupOrder.getOrganizer().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only the group organizer can place the group order");
        }

        List<GroupCartItem> items = groupCartItemRepository.findByGroupOrderId(groupOrderId);
        if (items.isEmpty()) {
            throw new BadRequestException("Cannot place group order with an empty cart");
        }

        groupOrder.setStatus(GroupOrderStatus.PLACED);
        groupOrderRepository.save(groupOrder);

        List<Order> generatedOrders = new ArrayList<>();

        if (groupOrder.getDeliveryMode() == DeliveryMode.COMMON) {
            // Create ONE master order for the group
            double total = items.stream().mapToDouble(i -> i.getFoodItem().getPrice() * i.getQuantity()).sum();
            Order masterOrder = new Order(
                    groupOrder.getOrganizer(),
                    groupOrder.getRestaurant(),
                    total,
                    groupOrder.getOrganizer().getAddress() != null ? groupOrder.getOrganizer().getAddress() : "Group Booth Delivery",
                    OrderStatus.PLACED
            );

            for (GroupCartItem item : items) {
                OrderItem oi = new OrderItem(masterOrder, item.getFoodItem(), item.getQuantity(), item.getFoodItem().getPrice());
                masterOrder.addItem(oi);
            }

            Order saved = orderRepository.save(masterOrder);

            // Auto-create initial payment record
            Payment payment = new Payment(saved, total, "GROUP_SPLIT", PaymentStatus.PAID, "GRP-" + groupOrder.getGroupCode(), LocalDateTime.now());
            paymentRepository.save(payment);

            generatedOrders.add(saved);
        } else {
            // Create ONE order PER member (INDIVIDUAL delivery mode)
            Map<GroupMember, List<GroupCartItem>> memberItemsMap = items.stream()
                    .collect(Collectors.groupingBy(GroupCartItem::getMember));

            for (Map.Entry<GroupMember, List<GroupCartItem>> entry : memberItemsMap.entrySet()) {
                GroupMember member = entry.getKey();
                List<GroupCartItem> memberItems = entry.getValue();

                double memberTotal = memberItems.stream().mapToDouble(i -> i.getFoodItem().getPrice() * i.getQuantity()).sum();
                Order memberOrder = new Order(
                        member.getUser(),
                        groupOrder.getRestaurant(),
                        memberTotal,
                        member.getUser().getAddress() != null ? member.getUser().getAddress() : "Booth Delivery",
                        OrderStatus.PLACED
                );

                for (GroupCartItem mi : memberItems) {
                    OrderItem oi = new OrderItem(memberOrder, mi.getFoodItem(), mi.getQuantity(), mi.getFoodItem().getPrice());
                    memberOrder.addItem(oi);
                }

                Order saved = orderRepository.save(memberOrder);

                Payment payment = new Payment(saved, memberTotal, "INDIVIDUAL_CARD", PaymentStatus.PAID, "GRP-IND-" + member.getId(), LocalDateTime.now());
                paymentRepository.save(payment);

                generatedOrders.add(saved);
            }
        }

        return generatedOrders.stream()
                .map(o -> new OrderResponse(o, paymentRepository.findByOrderId(o.getId()).orElse(null), null))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GroupOrderResponse> getGroupOrdersForUser(User user) {
        if (user.getRole() == Role.RESTAURANT) {
            Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId()).orElse(null);
            if (restaurant == null) {
                return List.of();
            }
            return groupOrderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurant.getId()).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        return groupOrderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<String> handleRestaurantAction(Long groupOrderId, String action, String reason, User user) {
        GroupOrder groupOrder = groupOrderRepository.findById(groupOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Group order not found with id: " + groupOrderId));

        if (user.getRole() != Role.RESTAURANT && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only restaurant staff or admins can accept/reject group orders");
        }

        if ("REJECT".equalsIgnoreCase(action)) {
            groupOrder.setStatus(GroupOrderStatus.CANCELLED);
            groupOrderRepository.save(groupOrder);

            // Mark any linked orders as CANCELLED and payments as REFUNDED
            List<Order> orders = orderRepository.findByRestaurantIdOrderByCreatedAtDesc(groupOrder.getRestaurant().getId());
            for (Order o : orders) {
                if (o.getCreatedAt().isAfter(groupOrder.getCreatedAt())) {
                    o.setStatus(OrderStatus.CANCELLED);
                    orderRepository.save(o);
                    paymentRepository.findByOrderId(o.getId()).ifPresent(p -> {
                        p.setStatus(PaymentStatus.REFUNDED);
                        paymentRepository.save(p);
                    });
                }
            }

            String reasonMsg = (reason != null && !reason.isBlank()) ? " Reason: " + reason : "";
            return ApiResponse.ok("Group order was rejected." + reasonMsg + " All associated payments have been REFUNDED.");
        } else {
            // ACCEPT
            return ApiResponse.ok("Group order confirmed by restaurant kitchen.");
        }
    }

    private void validateMemberAccess(GroupOrder groupOrder, User user) {
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.RESTAURANT) {
            return;
        }
        boolean isMember = groupMemberRepository.existsByGroupOrderIdAndUserId(groupOrder.getId(), user.getId());
        if (!isMember) {
            throw new UnauthorizedException("You are not a member of this group order");
        }
    }

    private String generateUniqueGroupCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder("BOOTH-");
            for (int i = 0; i < 3; i++) {
                sb.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
            }
            code = sb.toString();
        } while (groupOrderRepository.existsByGroupCode(code));
        return code;
    }

    private GroupOrderResponse mapToResponse(GroupOrder group) {
        List<GroupMember> members = groupMemberRepository.findByGroupOrderId(group.getId());
        List<GroupCartItem> items = groupCartItemRepository.findByGroupOrderId(group.getId());

        Map<Long, List<GroupCartItem>> itemsByMember = items.stream()
                .collect(Collectors.groupingBy(i -> i.getMember().getId()));

        List<GroupMemberResponse> memberResponses = members.stream().map(m -> {
            List<GroupCartItem> mItems = itemsByMember.getOrDefault(m.getId(), Collections.emptyList());
            int count = mItems.stream().mapToInt(GroupCartItem::getQuantity).sum();
            double subtotal = mItems.stream().mapToDouble(i -> i.getFoodItem().getPrice() * i.getQuantity()).sum();
            return new GroupMemberResponse(m, count, subtotal);
        }).collect(Collectors.toList());

        List<GroupCartItemResponse> itemResponses = items.stream()
                .map(GroupCartItemResponse::new)
                .collect(Collectors.toList());

        return new GroupOrderResponse(group, memberResponses, itemResponses);
    }
}
