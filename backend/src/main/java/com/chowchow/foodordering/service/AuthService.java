package com.chowchow.foodordering.service;

import com.chowchow.foodordering.dto.AuthResponse;
import com.chowchow.foodordering.dto.LoginRequest;
import com.chowchow.foodordering.dto.RegisterRequest;
import com.chowchow.foodordering.dto.UserProfileUpdateRequest;
import com.chowchow.foodordering.dto.UserResponse;
import com.chowchow.foodordering.entity.Cart;
import com.chowchow.foodordering.entity.Role;
import com.chowchow.foodordering.entity.User;
import com.chowchow.foodordering.exception.BadRequestException;
import com.chowchow.foodordering.exception.ResourceNotFoundException;
import com.chowchow.foodordering.exception.UnauthorizedException;
import com.chowchow.foodordering.repository.CartRepository;
import com.chowchow.foodordering.repository.UserRepository;
import com.chowchow.foodordering.security.JwtUtil;
import com.chowchow.foodordering.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       CartRepository cartRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(request.getRole() != null ? request.getRole() : Role.CUSTOMER);
        user.setActive(true);
        user.setOnline(true);

        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.CUSTOMER) {
            cartRepository.save(new Cart(savedUser));
        }

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().name());
        return new AuthResponse(token, savedUser.getRole(), new UserResponse(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!user.isActive()) {
            throw new UnauthorizedException("Your account has been deactivated. Please contact support.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getRole(), new UserResponse(user));
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User is not authenticated");
        }

        String email;
        if (authentication.getPrincipal() instanceof UserPrincipal) {
            email = ((UserPrincipal) authentication.getPrincipal()).getUsername();
        } else {
            email = authentication.getName();
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found in database"));
    }

    @Transactional
    public UserResponse updateProfile(User user, UserProfileUpdateRequest request) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getName() != null && !request.getName().isBlank()) existing.setName(request.getName());
        if (request.getPhone() != null) existing.setPhone(request.getPhone());
        if (request.getAddress() != null) existing.setAddress(request.getAddress());
        if (request.getVehicleType() != null) existing.setVehicleType(request.getVehicleType());
        if (request.getVehicleNumber() != null) existing.setVehicleNumber(request.getVehicleNumber());
        if (request.getOnline() != null) existing.setOnline(request.getOnline());

        User saved = userRepository.save(existing);
        return new UserResponse(saved);
    }

    @Transactional
    public UserResponse toggleOnlineStatus(User user) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        existing.setOnline(!existing.isOnline());
        User saved = userRepository.save(existing);
        return new UserResponse(saved);
    }
}
