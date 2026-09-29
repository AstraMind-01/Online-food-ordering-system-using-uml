package com.chowchow.foodordering.config;

import com.chowchow.foodordering.entity.*;
import com.chowchow.foodordering.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RestaurantRepository restaurantRepository,
                           FoodItemRepository foodItemRepository,
                           CartRepository cartRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.foodItemRepository = foodItemRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Users
        User admin = getOrCreateUser("Sally Boss", "admin@chowchow.com", "admin123", "555-0100", "742 Evergreen Terrace, Suite 100", Role.ADMIN);
        User owner = getOrCreateUser("Big Bill", "owner@chowchow.com", "owner123", "555-0101", "Route 66 Diner Strip, Springfield", Role.RESTAURANT);
        User cust1 = getOrCreateUser("Sally Brady", "customer1@chowchow.com", "cust123", "555-0102", "742 Evergreen Terrace (Booth 4)", Role.CUSTOMER);
        User cust2 = getOrCreateUser("Johnny Nitro", "customer2@chowchow.com", "cust123", "555-0103", "12 Vintage Blvd, Springfield", Role.CUSTOMER);
        User driver = getOrCreateUser("Speedy Sam", "driver@chowchow.com", "driver123", "555-0104", "Springfield Depot", Role.DELIVERY_PARTNER);

        // Ensure Customers have carts
        if (cartRepository.findByCustomerId(cust1.getId()).isEmpty()) {
            cartRepository.save(new Cart(cust1));
        }
        if (cartRepository.findByCustomerId(cust2.getId()).isEmpty()) {
            cartRepository.save(new Cart(cust2));
        }

        // 2. Seed Restaurant
        Restaurant restaurant;
        if (restaurantRepository.count() == 0) {
            restaurant = new Restaurant(
                    owner,
                    "Chow Chow Retro Diner & Eats",
                    "Classic American Diner, Malts & Burgers",
                    "742 Evergreen Terrace, Springfield",
                    4.9,
                    true,
                    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80"
            );
            restaurant = restaurantRepository.save(restaurant);
        } else {
            restaurant = restaurantRepository.findAll().get(0);
        }

        // 3. Seed 12 Diner Menu Items
        if (foodItemRepository.count() < 12) {
            List<FoodItem> items = Arrays.asList(
                    new FoodItem(restaurant, "Route 66 Triple Bacon Stack",
                            "Crispy smoked bacon, grilled brioche & diner secret relish",
                            12.45,
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuDL3gOc_Q6ygkb7n_hqwJ3U-ORWKkntTOOGhLzXCY7w7zE8ZIAMcTArnzI5AiQhtlb6S97YTvzTIJg3E6Ef6Ppa7XebuYRoPk03AyqM0Uu_1UnhRJBdqVHOr04O8sxMQ0eQA-lUgXwWihIJihPRARMWV0vxaSj_OSs7L69fxR5VXq8IfkyIToffa4_XVklL3DHglyFCZtEW5b59gciF3srC_dZHBiHIaR4uZ2QT_439NZmWtE6qxF1h",
                            "Juicy Burgers", "★ CLASSIC SPECIAL", 8, true),

                    new FoodItem(restaurant, "Jukebox Jalapeño Melt",
                            "Fire-roasted jalapeños, melted pepper jack & spiced secret aioli on sourdough",
                            11.95,
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuDImiRou9pZncwd_QKdJwfF2oddtJM6qe9LejdjAk9kU-VmPhfGKuDeXoLdev080FIqBb3EegRlQLcgGHjSsRSJnbJHhRXHy7xAtU8li2KeNF7efW1lu3sND3NLxAFAwhFaXr4JXevPQFVmAQS9MvyOefhp7YgTSaeUE55Z-ig7gfC1AYRDUo5S5Lg6pd4EVweZatSkLqXk0OPnMIoC9DZMn-To0ejPrWSfTUWx8JOGrQp1GG8o9Cnh",
                            "Juicy Burgers", "★ SPICY PICK", 7, true),

                    new FoodItem(restaurant, "Cherry Cola Float",
                            "Fountain cherry cola topped with Madagascar vanilla bean ice cream & maraschino",
                            5.50,
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuDoZxQuCZjoebNJODjhyJESxQlYgLaQhRW4-fIUfUeotsVlQkgH7_gntG2dBgZR9IRR88WjdrI1XyZhS4en_jc71O1JcOlOxo3L-FFCdLuXLMshNc9blA52EBvk3ZiD3nu3LpR7gSxwoCCQVYWa2SNrV5BHfoOGNbAOtFoVJJhe1geLoWc0YB2dB0ffgqzH7rAYQcWePhpujhpyNXr1zm9St7Qi8M9PWxd3hbLCDrJWf6Mt4g4dasuH",
                            "Thick Malts & Shakes", "★ SWEET TREAT", 5, true),

                    new FoodItem(restaurant, "Neon Night Chili Cheese Fries",
                            "Golden crinkle fries smothered in Texas road chili, aged cheddar & green onions",
                            7.95,
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuAO2eh4PZEcyMoktobhphBW-1t_dXhmeaAnQjCiG6gnsXPCSr4CjlqgySRva2pIgwRZAe-lZ1WrnUUgIcle7zQln2mr6RLDCWBq29yqK5uR51ncwEwBEP8Ear9Eh2sAxlULwBzXEEs1v4IFOG5rtN2wh8taP6l6uSBEoNUs30eoySN90nnMgJC52ncpYiNmTOwm2TQG2Sp9Yar4Klqc9_6SRgVNSOjfjq7Fo9AbMWEbAeBzOCU5tmVh",
                            "Crinkle Fries", "★ SHAREABLE", 6, true),

                    new FoodItem(restaurant, "Drive-In Chicken Basket",
                            "Crispy buttermilk fried chicken tenders served with honey mustard & diner slaw",
                            13.50,
                            "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
                            "Fried Chicken Baskets", "★ CROWD FAVORITE", 10, true),

                    new FoodItem(restaurant, "Malt Shop Vanilla Shake",
                            "Thick malted barley shake spun in classic steel cans with whipped cream peak",
                            6.25,
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuCUX06h_GTrBqVutq0m2qxKzgiPInRwc9dcCz2aft0rBV29FhE3IlQml-2w9Q0Xd5bRlfNQsESdX-KSfXS2STkNzv-E6BKpgD3M1C2UAheBKLPd7hj6G3jMqd_7lPjI9J0xb1Yr02VG-NA4-Artcs91ufaKnsCHNm0jTwr4J92OK3o2zH-ng_oY_xWGf6X2-OjuK0xBkU0TMaa57qFUKIx93tBvxO2XzTVhH5OXKKJfXnsdl8EkzruD",
                            "Thick Malts & Shakes", "★ OLD SCHOOL", 5, true),

                    new FoodItem(restaurant, "Blue Plate Meatloaf Melt",
                            "Home-style glazed beef meatloaf on griddled caraway rye with melted Swiss",
                            12.95,
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuAepflTShAE-KO4FlAI2SAZ96L-3fC_ab7LReW5F-kCX1z_fEga8NAE2c0p3bS-LsqXlnca1wPZvVop1jPWOOaUq0r6Bzs3zebF8yACt5gSBVH91ymVOFHqI_pXr4Qfr8Lok8-KqMTHOpcWxd-I8uF3aMfUOeC2s5jUbhoEPbOjAHeJIU9uFfMjJWywbH6hxQ3H4-2yEAG--OX2hf6-i1v2MrQh_k_4bJ1_MY785LPVGBjlZ6iwxd2G",
                            "Juicy Burgers", "★ DINER STAPLE", 12, true),

                    new FoodItem(restaurant, "Sunrise Pancake Tower",
                            "Fluffy buttermilk pancake stack with whipped sweet butter & warm maple drizzle",
                            9.95,
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuD7BfWUcq0oXoxSGCSZBxjEZFpOEBbKDYqXilK4ZSz-UTW1l2mDVIKpjf3LqqrIeTuI1ylkU1rwoqkU6B-T1qImlaueT2CVn7uChQueSjuXVXFxZqW907GsrdWxdnGPlcKwW1hHI6-_QrasZ7Ywu6d4UawaQUkw1zsNcmM779AK2NPrkXkJtbm7es7hLCRqwsAhJ-vN8fXnGmVFTLSSfl-IAdJMGdeXPbYsQaK-dmTGpQ_MyVmlOiDL",
                            "All-Day Breakfast", "★ ALL-DAY BREAKFAST", 9, true),

                    new FoodItem(restaurant, "Chicago Dog Deluxe",
                            "All-beef frank on poppy seed bun with yellow mustard, neon relish, sport peppers",
                            8.50,
                            "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80",
                            "Street Style", "★ STREET STYLE", 6, true),

                    new FoodItem(restaurant, "Golden Onion Ring Tower",
                            "Beer-battered jumbo Vidalia onions stacked high with smoky campfire dip",
                            6.75,
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuA_a9lG45cMxCs_SujnGOD789YutO6YkVHMYmPAQZ_Zbjbabsl8qn9rt7lyJLbWC5sJHQP-S-WYQOm2BpnCMaOH4NiVJ7eQWEMARYOo-TtIaPTyGTGRYDkc0RIQQ7XcShzpFwKmzb2YWel9YCmCtoPLYkv7aPe3mQde-EsZhX7KgxmIDJyg4mVCxtK8cIyVEDsW6B2Q6cVah83eNG3u2wTUaAjbrdTLLrZMuJlWNUV8OtfiWD33OScA",
                            "Crinkle Fries", "★ CRUNCH ALERT", 7, true),

                    new FoodItem(restaurant, "Apple Pie à la Mode",
                            "Flaky double-crust cinnamon spiced apples with a scoop of vanilla bean cream",
                            7.25,
                            "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
                            "Warm Diner Pies", "★ HOMEMADE", 5, true),

                    new FoodItem(restaurant, "Coney Island Loaded Hot Dog",
                            "Charred beef dog loaded with hearty beef chili, diced sweet onions, yellow mustard",
                            8.95,
                            "https://images.unsplash.com/photo-1541214113241-21578d2d9b62?auto=format&fit=crop&w=800&q=80",
                            "Street Style", "★ HOT SELLER", 6, true)
            );

            foodItemRepository.saveAll(items);
        }
    }

    private User getOrCreateUser(String name, String email, String rawPassword, String phone, String address, Role role) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User(name, email, passwordEncoder.encode(rawPassword), phone, address, role);
            return userRepository.save(user);
        } else {
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setActive(true);
            return userRepository.save(user);
        }
    }
}
