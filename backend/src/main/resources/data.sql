-- Seed Data for Online Food Ordering and Delivery Management System

-- 1. Users (Passwords: admin123, owner123, cust123, driver123 - BCrypt hashed)
-- BCrypt for 'admin123': $2a$10$wN1iN2QyNlA7h2v6qVwVbOSWd2.kXvKk8U9m5a1l8wz2GzYpUa1fO
-- BCrypt for 'owner123': $2a$10$5o8gI1j2k3l4m5n6o7p8q.r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g
-- BCrypt for 'cust123': $2a$10$Z1x2c3v4b5n6m7a8s9d0f.g1h2j3k4l5q6w7e8r9t0y1u2i3o4p5a
-- BCrypt for 'driver123': $2a$10$q1w2e3r4t5y6u7i8o9p0a.s1d2f3g4h5j6k7l8z9x0c1v2b3n4m5a

INSERT IGNORE INTO users (id, name, email, password, phone, address, role, active, vehicle_type, vehicle_number, online)
VALUES 
(1, 'Sally Boss', 'admin@chowchow.com', '$2a$10$wN1iN2QyNlA7h2v6qVwVbOSWd2.kXvKk8U9m5a1l8wz2GzYpUa1fO', '555-0100', '742 Evergreen Terrace, Suite 100', 'ADMIN', true, 'Dispatch Van', 'AD-01', true),
(2, 'Big Bill', 'owner@chowchow.com', '$2a$10$wN1iN2QyNlA7h2v6qVwVbOSWd2.kXvKk8U9m5a1l8wz2GzYpUa1fO', '555-0101', 'Route 66 Diner Strip, Springfield', 'RESTAURANT', true, 'Diner Truck', 'OW-99', true),
(3, 'Sally Brady', 'customer1@chowchow.com', '$2a$10$wN1iN2QyNlA7h2v6qVwVbOSWd2.kXvKk8U9m5a1l8wz2GzYpUa1fO', '555-0102', '742 Evergreen Terrace (Booth 4)', 'CUSTOMER', true, 'Sedan', 'CU-10', true),
(4, 'Johnny Nitro', 'customer2@chowchow.com', '$2a$10$wN1iN2QyNlA7h2v6qVwVbOSWd2.kXvKk8U9m5a1l8wz2GzYpUa1fO', '555-0103', '12 Vintage Blvd, Springfield', 'CUSTOMER', true, 'Cruiser', 'CU-20', true),
(5, 'Speedy Sam', 'driver@chowchow.com', '$2a$10$wN1iN2QyNlA7h2v6qVwVbOSWd2.kXvKk8U9m5a1l8wz2GzYpUa1fO', '555-0104', 'Springfield Depot', 'DELIVERY_PARTNER', true, 'Vintage Motorcycle', 'TX-ROAD-77', true);

UPDATE users SET password = '$2a$10$wN1iN2QyNlA7h2v6qVwVbOSWd2.kXvKk8U9m5a1l8wz2GzYpUa1fO' WHERE id <= 5;

-- 2. Restaurant
INSERT IGNORE INTO restaurants (id, owner_id, name, cuisine, address, rating, is_open, image_url, latitude, longitude)
VALUES (1, 2, 'Chow Chow Retro Diner & Eats', 'Classic American Diner, Malts & Burgers', '742 Evergreen Terrace, Springfield', 4.9, true, 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80', 30.2672, -97.7431);

-- 3. The 12 Diner Menu Items
INSERT IGNORE INTO food_items (id, restaurant_id, name, description, price, image_url, category, badge_text, prep_time_mins, available)
VALUES
(1, 1, 'Route 66 Triple Bacon Stack', 'Crispy smoked bacon, grilled brioche & diner secret relish', 12.45, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3gOc_Q6ygkb7n_hqwJ3U-ORWKkntTOOGhLzXCY7w7zE8ZIAMcTArnzI5AiQhtlb6S97YTvzTIJg3E6Ef6Ppa7XebuYRoPk03AyqM0Uu_1UnhRJBdqVHOr04O8sxMQ0eQA-lUgXwWihIJihPRARMWV0vxaSj_OSs7L69fxR5VXq8IfkyIToffa4_XVklL3DHglyFCZtEW5b59gciF3srC_dZHBiHIaR4uZ2QT_439NZmWtE6qxF1h', 'Juicy Burgers', '★ CLASSIC SPECIAL', 8, true),
(2, 1, 'Jukebox Jalapeño Melt', 'Fire-roasted jalapeños, melted pepper jack & spiced secret aioli on sourdough', 11.95, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDImiRou9pZncwd_QKdJwfF2oddtJM6qe9LejdjAk9kU-VmPhfGKuDeXoLdev080FIqBb3EegRlQLcgGHjSsRSJnbJHhRXHy7xAtU8li2KeNF7efW1lu3sND3NLxAFAwhFaXr4JXevPQFVmAQS9MvyOefhp7YgTSaeUE55Z-ig7gfC1AYRDUo5S5Lg6pd4EVweZatSkLqXk0OPnMIoC9DZMn-To0ejPrWSfTUWx8JOGrQp1GG8o9Cnh', 'Juicy Burgers', '★ SPICY PICK', 7, true),
(3, 1, 'Cherry Cola Float', 'Fountain cherry cola topped with Madagascar vanilla bean ice cream & maraschino', 5.50, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZxQuCZjoebNJODjhyJESxQlYgLaQhRW4-fIUfUeotsVlQkgH7_gntG2dBgZR9IRR88WjdrI1XyZhS4en_jc71O1JcOlOxo3L-FFCdLuXLMshNc9blA52EBvk3ZiD3nu3LpR7gSxwoCCQVYWa2SNrV5BHfoOGNbAOtFoVJJhe1geLoWc0YB2dB0ffgqzH7rAYQcWePhpujhpyNXr1zm9St7Qi8M9PWxd3hbLCDrJWf6Mt4g4dasuH', 'Thick Malts & Shakes', '★ SWEET TREAT', 5, true),
(4, 1, 'Neon Night Chili Cheese Fries', 'Golden crinkle fries smothered in Texas road chili, aged cheddar & green onions', 7.95, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO2eh4PZEcyMoktobhphBW-1t_dXhmeaAnQjCiG6gnsXPCSr4CjlqgySRva2pIgwRZAe-lZ1WrnUUgIcle7zQln2mr6RLDCWBq29yqK5uR51ncwEwBEP8Ear9Eh2sAxlULwBzXEEs1v4IFOG5rtN2wh8taP6l6uSBEoNUs30eoySN90nnMgJC52ncpYiNmTOwm2TQG2Sp9Yar4Klqc9_6SRgVNSOjfjq7Fo9AbMWEbAeBzOCU5tmVh', 'Crinkle Fries', '★ SHAREABLE', 6, true),
(5, 1, 'Drive-In Chicken Basket', 'Crispy buttermilk fried chicken tenders served with honey mustard & diner slaw', 13.50, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80', 'Fried Chicken Baskets', '★ CROWD FAVORITE', 10, true),
(6, 1, 'Malt Shop Vanilla Shake', 'Thick malted barley shake spun in classic steel cans with whipped cream peak', 6.25, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUX06h_GTrBqVutq0m2qxKzgiPInRwc9dcCz2aft0rBV29FhE3IlQml-2w9Q0Xd5bRlfNQsESdX-KSfXS2STkNzv-E6BKpgD3M1C2UAheBKLPd7hj6G3jMqd_7lPjI9J0xb1Yr02VG-NA4-Artcs91ufaKnsCHNm0jTwr4J92OK3o2zH-ng_oY_xWGf6X2-OjuK0xBkU0TMaa57qFUKIx93tBvxO2XzTVhH5OXKKJfXnsdl8EkzruD', 'Thick Malts & Shakes', '★ OLD SCHOOL', 5, true),
(7, 1, 'Blue Plate Meatloaf Melt', 'Home-style glazed beef meatloaf on griddled caraway rye with melted Swiss', 12.95, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAepflTShAE-KO4FlAI2SAZ96L-3fC_ab7LReW5F-kCX1z_fEga8NAE2c0p3bS-LsqXlnca1wPZvVop1jPWOOaUq0r6Bzs3zebF8yACt5gSBVH91ymVOFHqI_pXr4Qfr8Lok8-KqMTHOpcWxd-I8uF3aMfUOeC2s5jUbhoEPbOjAHeJIU9uFfMjJWywbH6hxQ3H4-2yEAG--OX2hf6-i1v2MrQh_k_4bJ1_MY785LPVGBjlZ6iwxd2G', 'Juicy Burgers', '★ DINER STAPLE', 12, true),
(8, 1, 'Sunrise Pancake Tower', 'Fluffy buttermilk pancake stack with whipped sweet butter & warm maple drizzle', 9.95, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7BfWUcq0oXoxSGCSZBxjEZFpOEBbKDYqXilK4ZSz-UTW1l2mDVIKpjf3LqqrIeTuI1ylkU1rwoqkU6B-T1qImlaueT2CVn7uChQueSjuXVXFxZqW907GsrdWxdnGPlcKwW1hHI6-_QrasZ7Ywu6d4UawaQUkw1zsNcmM779AK2NPrkXkJtbm7es7hLCRqwsAhJ-vN8fXnGmVFTLSSfl-IAdJMGdeXPbYsQaK-dmTGpQ_MyVmlOiDL', 'All-Day Breakfast', '★ ALL-DAY BREAKFAST', 9, true),
(9, 1, 'Chicago Dog Deluxe', 'All-beef frank on poppy seed bun with yellow mustard, neon relish, sport peppers', 8.50, 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80', 'Street Style', '★ STREET STYLE', 6, true),
(10, 1, 'Golden Onion Ring Tower', 'Beer-battered jumbo Vidalia onions stacked high with smoky campfire dip', 6.75, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_a9lG45cMxCs_SujnGOD789YutO6YkVHMYmPAQZ_Zbjbabsl8qn9rt7lyJLbWC5sJHQP-S-WYQOm2BpnCMaOH4NiVJ7eQWEMARYOo-TtIaPTyGTGRYDkc0RIQQ7XcShzpFwKmzb2YWel9YCmCtoPLYkv7aPe3mQde-EsZhX7KgxmIDJyg4mVCxtK8cIyVEDsW6B2Q6cVah83eNG3u2wTUaAjbrdTLLrZMuJlWNUV8OtfiWD33OScA', 'Crinkle Fries', '★ CRUNCH ALERT', 7, true),
(11, 1, 'Apple Pie à la Mode', 'Flaky double-crust cinnamon spiced apples with a scoop of vanilla bean cream', 7.25, 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80', 'Warm Diner Pies', '★ HOMEMADE', 5, true),
(12, 1, 'Coney Island Loaded Hot Dog', 'Charred beef dog loaded with hearty beef chili, diced sweet onions, yellow mustard', 8.95, 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?auto=format&fit=crop&w=800&q=80', 'Street Style', '★ HOT SELLER', 6, true);

-- 4. Initial Carts for Customers
INSERT IGNORE INTO carts (id, customer_id) VALUES (1, 3), (2, 4);

-- 5. Seed Orders
INSERT IGNORE INTO orders (id, customer_id, restaurant_id, total_amount, delivery_address, delivery_latitude, delivery_longitude, status, created_at)
VALUES 
(1, 3, 1, 17.95, '742 Evergreen Terrace (Booth 4)', 30.2849, -97.7341, 'OUT_FOR_DELIVERY', '2026-09-29 00:35:00'),
(2, 4, 1, 19.90, '12 Vintage Blvd, Springfield', 30.2810, -97.7380, 'READY_FOR_PICKUP', '2026-09-29 00:45:00'),
(3, 3, 1, 13.50, '742 Evergreen Terrace (Booth 4)', 30.2849, -97.7341, 'DELIVERED', '2026-09-28 23:00:00');

-- 6. Seed Order Items
INSERT IGNORE INTO order_items (id, order_id, food_item_id, quantity, price)
VALUES 
(1, 1, 1, 1, 12.45),
(2, 1, 3, 1, 5.50),
(3, 2, 2, 1, 11.95),
(4, 2, 4, 1, 7.95),
(5, 3, 5, 1, 13.50);

-- 7. Seed Payments
INSERT IGNORE INTO payments (id, order_id, amount, method, status, transaction_ref, paid_at)
VALUES 
(1, 1, 17.95, 'CARD', 'PAID', 'TXN-RETRO-8491', '2026-09-29 00:36:00'),
(2, 2, 19.90, 'CASH', 'PENDING', 'TXN-RETRO-8492', NULL),
(3, 3, 13.50, 'CARD', 'PAID', 'TXN-RETRO-8480', '2026-09-28 23:05:00');

-- 8. Seed Deliveries
INSERT IGNORE INTO deliveries (id, order_id, delivery_partner_id, status, picked_up_at, delivered_at)
VALUES 
(1, 1, 5, 'PICKED_UP', '2026-09-29 00:48:00', NULL),
(2, 3, 5, 'DELIVERED', '2026-09-28 23:10:00', '2026-09-28 23:35:00');

-- 9. Seed Delivery Locations for Active Run (Delivery #1 / Order #1)
-- Moving along Route 66 from diner (30.2672, -97.7431) toward customer drop (30.2849, -97.7341)
INSERT IGNORE INTO delivery_locations (id, delivery_id, latitude, longitude, heading, speed, timestamp)
VALUES 
(1, 1, 30.2672, -97.7431, 45.0, 0.0, '2026-09-29 00:48:00'),
(2, 1, 30.2715, -97.7408, 48.0, 32.5, '2026-09-29 00:52:00'),
(3, 1, 30.2762, -97.7382, 46.5, 35.0, '2026-09-29 00:56:00'),
(4, 1, 30.2805, -97.7360, 47.0, 28.0, '2026-09-29 00:59:00');

