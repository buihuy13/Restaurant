-- ============================================
-- SEED DATA FOR RESTAURANT SERVICE (PostgreSQL)
-- All data in English with real Cloudinary URLs
-- ============================================

-- Categories
INSERT INTO categories (id, cate_name) VALUES
('CAT001', 'Beverages'),
('CAT002', 'Main Dishes'),
('CAT003', 'Side Dishes'),
('CAT004', 'Desserts'),
('CAT005', 'Fast Food'),
('CAT006', 'Vegetarian'),
('CAT007', 'Vietnamese'),
('CAT008', 'Korean'),
('CAT009', 'Japanese'),
('CAT010', 'Pizza & Pasta'),
('CAT011', 'American'),
('CAT012', 'Mexican'),
('CAT013', 'Healthy');

-- Sizes
INSERT INTO size (id, name) VALUES
('S', 'Small'),
('M', 'Medium'),
('L', 'Large'),
('XL', 'Extra Large');

-- ============================================
-- RESTAURANTS (12 total)
-- ============================================
INSERT INTO restaurants (id, res_name, address, longitude, latitude, rating, opening_time, closing_time, image_url, phone, merchant_id, slug, enabled) VALUES
('RES001', 'The Gourmet Kitchen', '123 Nguyen Hue, District 1, HCMC', 106.701317, 10.775658, 4.5, '10:00:00', '22:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', '0901234567', 'testmerchantid', 'the-gourmet-kitchen', true),
('RES002', 'Pho Hanoi', '456 Le Loi, District 1, HCMC', 106.698316, 10.773852, 4.8, '06:00:00', '21:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635341/gasot_opwrcw.jpg', '0901234568', 'merchant_002', 'pho-hanoi', true),
('RES003', 'Pizza Hut Express', '789 Tran Hung Dao, District 5, HCMC', 106.680088, 10.754292, 4.2, '10:00:00', '23:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', '0901234569', 'merchant_003', 'pizza-hut-express', true),
('RES004', 'Korean BBQ House', '321 Pasteur, District 3, HCMC', 106.690167, 10.784308, 4.6, '11:00:00', '23:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', '0901234570', 'merchant_004', 'korean-bbq-house', true),
('RES005', 'Sushi Tokyo', '555 Hai Ba Trung, District 1, HCMC', 106.696817, 10.788508, 4.7, '10:00:00', '22:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635330/daga_abs1zd.jpg', '0901234571', 'merchant_005', 'sushi-tokyo', true),
('RES006', 'Bubble Tea Cafe', '100 Nguyen Thi Minh Khai, District 3, HCMC', 106.686817, 10.780508, 4.4, '08:00:00', '22:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg', '0901234572', 'merchant_006', 'bubble-tea-cafe', true),
('RES007', 'Saigon Street Food', '200 Vo Van Tan, District 3, HCMC', 106.683817, 10.775508, 4.3, '06:00:00', '21:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', '0901234573', 'merchant_007', 'saigon-street-food', true),
('RES008', 'Banh Mi Express', '26 Le Thi Rieng, District 1, HCMC', 106.693817, 10.770508, 4.9, '06:00:00', '23:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', '0901234574', 'merchant_008', 'banh-mi-express', true),
('RES009', 'Burger House', '150 Dong Khoi, District 1, HCMC', 106.704817, 10.777508, 4.6, '10:00:00', '23:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', '0901234575', 'merchant_009', 'burger-house', true),
('RES010', 'Taco Bell Vietnam', '88 Pasteur, District 1, HCMC', 106.692817, 10.782508, 4.5, '11:00:00', '22:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635233/tacos_g0bqyg.jpg', '0901234576', 'merchant_010', 'taco-bell-vietnam', true),
('RES011', 'Fried Chicken King', '45 Le Thanh Ton, District 1, HCMC', 106.699817, 10.779508, 4.7, '10:00:00', '23:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', '0901234577', 'merchant_011', 'fried-chicken-king', true),
('RES012', 'Healthy Bowl', '99 Nguyen Du, District 1, HCMC', 106.695817, 10.781508, 4.8, '07:00:00', '21:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640680/orange-juice_qynanv.jpg', '0901234578', 'merchant_012', 'healthy-bowl', true);

-- ============================================
-- RESTAURANT CATEGORIES
-- ============================================
INSERT INTO restaurant_categories (restaurant_id, category_id) VALUES
-- The Gourmet Kitchen
('RES001', 'CAT011'),
('RES001', 'CAT005'),
-- Pho Hanoi
('RES002', 'CAT007'),
('RES002', 'CAT002'),
-- Pizza Hut Express
('RES003', 'CAT010'),
('RES003', 'CAT005'),
-- Korean BBQ House
('RES004', 'CAT008'),
('RES004', 'CAT002'),
-- Sushi Tokyo
('RES005', 'CAT009'),
('RES005', 'CAT002'),
-- Bubble Tea Cafe
('RES006', 'CAT001'),
-- Saigon Street Food
('RES007', 'CAT007'),
('RES007', 'CAT002'),
-- Banh Mi Express
('RES008', 'CAT005'),
('RES008', 'CAT007'),
-- Burger House
('RES009', 'CAT011'),
('RES009', 'CAT005'),
-- Taco Bell Vietnam
('RES010', 'CAT012'),
('RES010', 'CAT005'),
-- Fried Chicken King
('RES011', 'CAT011'),
('RES011', 'CAT005'),
-- Healthy Bowl
('RES012', 'CAT013'),
('RES012', 'CAT006');

-- ============================================
-- PRODUCTS (42 total)
-- ============================================
INSERT INTO products (id, product_name, description, restaurant_id, image_url, category_id, rating, slug, available, total_review) VALUES
-- The Gourmet Kitchen (RES001)
('PROD001', 'Classic Burger', 'Juicy beef patty with fresh lettuce, tomato, and special sauce', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', 'CAT011', 4.6, 'classic-burger', true, 0),
('PROD002', 'Margherita Pizza', 'Fresh mozzarella, tomato sauce, and basil on thin crust', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', 'CAT010', 4.5, 'margherita-pizza', true, 0),
('PROD003', 'Grilled Chicken Sandwich', 'Grilled chicken breast with avocado and chipotle mayo', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.7, 'grilled-chicken-sandwich', true, 0),
('PROD004', 'French Fries', 'Crispy golden fries with sea salt', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635297/khoaitaychien_n8njn6.jpg', 'CAT003', 4.4, 'french-fries', true, 0),

-- Pho Hanoi (RES002)
('PROD005', 'Beef Pho', 'Traditional Vietnamese beef noodle soup with fresh herbs', 'RES002', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635341/gasot_opwrcw.jpg', 'CAT007', 4.8, 'beef-pho', true, 0),
('PROD006', 'Chicken Pho', 'Light chicken broth with rice noodles and tender chicken', 'RES002', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT007', 4.6, 'chicken-pho', true, 0),
('PROD007', 'Spring Rolls', 'Fresh spring rolls with shrimp and vegetables', 'RES002', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', 'CAT003', 4.4, 'spring-rolls', true, 0),

-- Pizza Hut Express (RES003)
('PROD008', 'Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 'RES003', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', 'CAT010', 4.5, 'pepperoni-pizza', true, 0),
('PROD009', 'Seafood Pizza', 'Shrimp, squid, and mussels on tomato base', 'RES003', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', 'CAT010', 4.6, 'seafood-pizza', true, 0),
('PROD010', 'Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 'RES003', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', 'CAT010', 4.3, 'pasta-carbonara', true, 0),

-- Korean BBQ House (RES004)
('PROD011', 'Korean BBQ Beef', 'Marinated beef grilled Korean style', 'RES004', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT008', 4.7, 'korean-bbq-beef', true, 0),
('PROD012', 'Samgyeopsal', 'Grilled pork belly Korean style', 'RES004', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT008', 4.6, 'samgyeopsal', true, 0),
('PROD013', 'Kimchi Stew', 'Spicy kimchi stew with pork', 'RES004', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT008', 4.5, 'kimchi-stew', true, 0),

-- Sushi Tokyo (RES005)
('PROD014', 'Salmon Sushi', 'Fresh imported salmon sushi', 'RES005', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635330/daga_abs1zd.jpg', 'CAT009', 4.8, 'salmon-sushi', true, 0),
('PROD015', 'Sashimi Platter', 'Assorted sashimi - salmon, tuna, octopus', 'RES005', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635330/daga_abs1zd.jpg', 'CAT009', 4.9, 'sashimi-platter', true, 0),
('PROD016', 'California Roll', 'Classic California maki roll', 'RES005', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', 'CAT009', 4.5, 'california-roll', true, 0),

-- Bubble Tea Cafe (RES006)
('PROD017', 'Classic Milk Tea', 'Traditional milk tea with black pearls', 'RES006', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg', 'CAT001', 4.5, 'classic-milk-tea', true, 0),
('PROD018', 'Peach Tea', 'Refreshing peach tea with jelly', 'RES006', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640680/orange-juice_qynanv.jpg', 'CAT001', 4.6, 'peach-tea', true, 0),
('PROD019', 'Matcha Latte', 'Creamy matcha latte', 'RES006', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg', 'CAT001', 4.4, 'matcha-latte', true, 0),

-- Saigon Street Food (RES007)
('PROD020', 'Broken Rice Special', 'Broken rice with grilled pork, egg, and pickles', 'RES007', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', 'CAT007', 4.5, 'broken-rice-special', true, 0),
('PROD021', 'Grilled Pork Rice', 'Fragrant grilled pork with broken rice', 'RES007', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT007', 4.4, 'grilled-pork-rice', true, 0),

-- Banh Mi Express (RES008)
('PROD022', 'Special Banh Mi', 'Vietnamese sandwich with pate, cold cuts, and pickles', 'RES008', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', 'CAT005', 4.9, 'special-banh-mi', true, 0),
('PROD023', 'Grilled Pork Banh Mi', 'Banh mi with grilled pork and special sauce', 'RES008', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', 'CAT005', 4.7, 'grilled-pork-banh-mi', true, 0),

-- Burger House (RES009)
('PROD024', 'Double Cheeseburger', 'Two beef patties with double cheese and bacon', 'RES009', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', 'CAT011', 4.8, 'double-cheeseburger', true, 0),
('PROD025', 'Chicken Burger', 'Crispy fried chicken with coleslaw and mayo', 'RES009', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.5, 'chicken-burger', true, 0),
('PROD026', 'Veggie Burger', 'Plant-based patty with grilled vegetables', 'RES009', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', 'CAT006', 4.3, 'veggie-burger', true, 0),
('PROD027', 'Onion Rings', 'Crispy beer-battered onion rings', 'RES009', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635297/khoaitaychien_n8njn6.jpg', 'CAT003', 4.2, 'onion-rings', true, 0),

-- Taco Bell Vietnam (RES010)
('PROD028', 'Beef Tacos', 'Three soft tacos with seasoned beef, lettuce, and cheese', 'RES010', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635233/tacos_g0bqyg.jpg', 'CAT012', 4.6, 'beef-tacos', true, 0),
('PROD029', 'Chicken Burrito', 'Grilled chicken with rice, beans, and salsa wrapped in tortilla', 'RES010', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', 'CAT012', 4.7, 'chicken-burrito', true, 0),
('PROD030', 'Nachos Supreme', 'Tortilla chips with cheese, beef, sour cream, and jalapeños', 'RES010', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635297/khoaitaychien_n8njn6.jpg', 'CAT012', 4.5, 'nachos-supreme', true, 0),
('PROD031', 'Quesadilla', 'Grilled tortilla with melted cheese and chicken', 'RES010', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', 'CAT012', 4.4, 'quesadilla', true, 0),

-- Fried Chicken King (RES011)
('PROD032', 'Original Fried Chicken', 'Crispy fried chicken with secret 11 herbs and spices', 'RES011', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.8, 'original-fried-chicken', true, 0),
('PROD033', 'Spicy Chicken Wings', 'Hot and spicy chicken wings with ranch dip', 'RES011', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.7, 'spicy-chicken-wings', true, 0),
('PROD034', 'Chicken Tenders', 'Breaded chicken tenders with honey mustard', 'RES011', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.6, 'chicken-tenders', true, 0),
('PROD035', 'Coleslaw', 'Fresh creamy coleslaw', 'RES011', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635314/cheeseball_pibzk3.jpg', 'CAT003', 4.3, 'coleslaw', true, 0),

-- Healthy Bowl (RES012)
('PROD036', 'Quinoa Buddha Bowl', 'Quinoa with roasted vegetables, avocado, and tahini dressing', 'RES012', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', 'CAT013', 4.9, 'quinoa-buddha-bowl', true, 0),
('PROD037', 'Grilled Salmon Salad', 'Fresh salmon with mixed greens and lemon vinaigrette', 'RES012', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635330/daga_abs1zd.jpg', 'CAT013', 4.8, 'grilled-salmon-salad', true, 0),
('PROD038', 'Acai Bowl', 'Acai berries with granola, banana, and honey', 'RES012', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635314/cheeseball_pibzk3.jpg', 'CAT013', 4.7, 'acai-bowl', true, 0),
('PROD039', 'Green Smoothie', 'Spinach, kale, banana, and almond milk', 'RES012', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640680/orange-juice_qynanv.jpg', 'CAT001', 4.6, 'green-smoothie', true, 0),

-- Additional popular items
('PROD040', 'Coca Cola', 'Classic Coca Cola', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640626/cocacola_vyo2mu.jpg', 'CAT001', 4.5, 'coca-cola', true, 0),
('PROD041', 'Orange Juice', 'Freshly squeezed orange juice', 'RES012', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640680/orange-juice_qynanv.jpg', 'CAT001', 4.7, 'orange-juice', true, 0),
('PROD042', 'Iced Coffee', 'Vietnamese iced coffee', 'RES006', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg', 'CAT001', 4.6, 'iced-coffee', true, 0);

-- ============================================
-- PRODUCT SIZES (Sample pricing)
-- ============================================
INSERT INTO product_sizes (id, product_id, size_id, price) VALUES
-- The Gourmet Kitchen
('PS001', 'PROD001', 'M', 55000),
('PS002', 'PROD001', 'L', 75000),
('PS003', 'PROD002', 'M', 85000),
('PS004', 'PROD002', 'L', 120000),
('PS005', 'PROD003', 'M', 65000),
('PS006', 'PROD004', 'M', 25000),
('PS007', 'PROD004', 'L', 35000),

-- Pho Hanoi
('PS008', 'PROD005', 'M', 45000),
('PS009', 'PROD005', 'L', 55000),
('PS010', 'PROD006', 'M', 40000),
('PS011', 'PROD006', 'L', 50000),
('PS012', 'PROD007', 'M', 30000),

-- Pizza Hut Express
('PS013', 'PROD008', 'M', 150000),
('PS014', 'PROD008', 'L', 220000),
('PS015', 'PROD009', 'M', 180000),
('PS016', 'PROD009', 'L', 260000),
('PS017', 'PROD010', 'M', 95000),

-- Korean BBQ House
('PS018', 'PROD011', 'M', 189000),
('PS019', 'PROD011', 'L', 289000),
('PS020', 'PROD012', 'M', 169000),
('PS021', 'PROD012', 'L', 249000),
('PS022', 'PROD013', 'M', 79000),

-- Sushi Tokyo
('PS023', 'PROD014', 'M', 120000),
('PS024', 'PROD014', 'L', 180000),
('PS025', 'PROD015', 'M', 250000),
('PS026', 'PROD015', 'L', 380000),
('PS027', 'PROD016', 'M', 85000),

-- Bubble Tea Cafe
('PS028', 'PROD017', 'M', 35000),
('PS029', 'PROD017', 'L', 45000),
('PS030', 'PROD018', 'M', 40000),
('PS031', 'PROD018', 'L', 50000),
('PS032', 'PROD019', 'M', 45000),
('PS033', 'PROD019', 'L', 55000),

-- Saigon Street Food
('PS034', 'PROD020', 'M', 45000),
('PS035', 'PROD020', 'L', 60000),
('PS036', 'PROD021', 'M', 40000),
('PS037', 'PROD021', 'L', 55000),

-- Banh Mi Express
('PS038', 'PROD022', 'M', 45000),
('PS039', 'PROD023', 'M', 40000),

-- Burger House
('PS040', 'PROD024', 'M', 85000),
('PS041', 'PROD024', 'L', 110000),
('PS042', 'PROD025', 'M', 65000),
('PS043', 'PROD025', 'L', 85000),
('PS044', 'PROD026', 'M', 60000),
('PS045', 'PROD027', 'M', 30000),

-- Taco Bell
('PS046', 'PROD028', 'M', 48000),
('PS047', 'PROD028', 'L', 65000),
('PS048', 'PROD029', 'M', 52000),
('PS049', 'PROD029', 'L', 70000),
('PS050', 'PROD030', 'M', 55000),
('PS051', 'PROD030', 'L', 75000),
('PS052', 'PROD031', 'M', 45000),

-- Fried Chicken King
('PS053', 'PROD032', 'M', 65000),
('PS054', 'PROD032', 'L', 95000),
('PS055', 'PROD033', 'M', 70000),
('PS056', 'PROD033', 'L', 100000),
('PS057', 'PROD034', 'M', 60000),
('PS058', 'PROD035', 'M', 20000),

-- Healthy Bowl
('PS059', 'PROD036', 'M', 85000),
('PS060', 'PROD036', 'L', 110000),
('PS061', 'PROD037', 'M', 95000),
('PS062', 'PROD037', 'L', 130000),
('PS063', 'PROD038', 'M', 75000),
('PS064', 'PROD039', 'M', 45000),
('PS065', 'PROD039', 'L', 60000),

-- Beverages
('PS066', 'PROD040', 'M', 15000),
('PS067', 'PROD041', 'M', 20000),
('PS068', 'PROD042', 'M', 25000),
('PS069', 'PROD042', 'L', 35000);

-- ============================================
-- REVIEWS
-- ============================================
INSERT INTO reviews (id, title, content, rating, review_id, review_type, user_id) VALUES
('REV001', 'Amazing burgers!', 'The Classic Burger is delicious! Juicy and flavorful.', 5.0, 'RES001', 'RESTAURANT', 'testuserid'),
('REV002', 'Best Pho in town', 'Authentic Vietnamese pho with rich broth', 4.8, 'RES002', 'RESTAURANT', 'user_gen_01'),
('REV003', 'Good pizza but slow', 'Pizza is tasty but delivery took a while', 4.0, 'RES003', 'RESTAURANT', 'user_gen_02'),
('REV004', 'Super fresh sushi', 'Salmon melts in your mouth. Worth the price!', 5.0, 'RES005', 'RESTAURANT', 'user_gen_03'),
('REV005', 'Great bubble tea', 'Love the pearls, tea is fragrant', 4.5, 'RES006', 'RESTAURANT', 'user_gen_04'),
('REV006', 'Best double cheeseburger ever!', 'Burger House makes the best burgers in HCMC!', 5.0, 'RES009', 'RESTAURANT', 'user_gen_05'),
('REV007', 'Authentic Mexican taste', 'Tacos taste just like in Mexico!', 4.8, 'RES010', 'RESTAURANT', 'user_gen_06'),
('REV008', 'Crispy and delicious', 'Fried chicken is perfectly crispy', 4.9, 'RES011', 'RESTAURANT', 'user_gen_07'),
('REV009', 'Healthy and tasty', 'Finally healthy food that tastes good!', 5.0, 'RES012', 'RESTAURANT', 'user_gen_08'),
('REV010', 'Perfect for diet', 'Quinoa Buddha Bowl is my favorite!', 4.8, 'RES012', 'RESTAURANT', 'testuserid');
