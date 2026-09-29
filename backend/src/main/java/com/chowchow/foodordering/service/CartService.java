package com.chowchow.foodordering.service;

import com.chowchow.foodordering.dto.CartItemRequest;
import com.chowchow.foodordering.dto.CartItemResponse;
import com.chowchow.foodordering.dto.CartResponse;
import com.chowchow.foodordering.entity.Cart;
import com.chowchow.foodordering.entity.CartItem;
import com.chowchow.foodordering.entity.FoodItem;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.exception.BadRequestException;
import com.chowchow.foodordering.exception.ResourceNotFoundException;
import com.chowchow.foodordering.repository.CartItemRepository;
import com.chowchow.foodordering.repository.CartRepository;
import com.chowchow.foodordering.repository.FoodItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final FoodItemRepository foodItemRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       FoodItemRepository foodItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.foodItemRepository = foodItemRepository;
    }

    @Transactional
    public Cart getOrCreateCart(User user) {
        return cartRepository.findByCustomerId(user.getId())
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    @Transactional(readOnly = true)
    public CartResponse getCartForCustomer(User user) {
        Cart cart = getOrCreateCart(user);
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(CartItemResponse::new)
                .collect(Collectors.toList());
        return new CartResponse(cart.getId(), itemResponses);
    }

    @Transactional
    public CartResponse addItemToCart(User user, CartItemRequest request) {
        Cart cart = getOrCreateCart(user);

        FoodItem foodItem = foodItemRepository.findById(request.getFoodItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + request.getFoodItemId()));

        if (!foodItem.isAvailable()) {
            throw new BadRequestException("Item '" + foodItem.getName() + "' is currently unavailable");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndFoodItemId(cart.getId(), foodItem.getId());

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(cart, foodItem, request.getQuantity());
            cart.addItem(newItem);
            cartRepository.save(cart);
        }

        return getCartForCustomer(user);
    }

    @Transactional
    public CartResponse updateCartItemQuantity(User user, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to user cart");
        }

        if (quantity <= 0) {
            cart.removeItem(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCartForCustomer(user);
    }

    @Transactional
    public CartResponse removeCartItem(User user, Long itemId) {
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to user cart");
        }

        cart.removeItem(item);
        cartItemRepository.delete(item);

        return getCartForCustomer(user);
    }

    @Transactional
    public CartResponse clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
        return getCartForCustomer(user);
    }
}
