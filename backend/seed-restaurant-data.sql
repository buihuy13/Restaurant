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
('RES001', 'The Gourmet Kitchen', '123 Nguyen Hue, District 1, HCMC', 106.701317, 10.775658, 4.5, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', '0901234567', 'testmerchantid', 'the-gourmet-kitchen', true),
('RES002', 'Pho Hanoi', '456 Le Loi, District 1, HCMC', 106.698316, 10.773852, 4.8, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635341/gasot_opwrcw.jpg', '0901234568', 'merchant_002', 'pho-hanoi', true),
('RES003', 'Pizza Hut Express', '789 Tran Hung Dao, District 5, HCMC', 106.680088, 10.754292, 4.2, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', '0901234569', 'merchant_003', 'pizza-hut-express', true),
('RES004', 'Korean BBQ House', '321 Pasteur, District 3, HCMC', 106.690167, 10.784308, 4.6, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', '0901234570', 'merchant_004', 'korean-bbq-house', true),
('RES005', 'Sushi Tokyo', '555 Hai Ba Trung, District 1, HCMC', 106.696817, 10.788508, 4.7, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635330/daga_abs1zd.jpg', '0901234571', 'merchant_005', 'sushi-tokyo', true),
('RES006', 'Bubble Tea Cafe', '100 Nguyen Thi Minh Khai, District 3, HCMC', 106.686817, 10.780508, 4.4, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg', '0901234572', 'merchant_006', 'bubble-tea-cafe', true),
('RES007', 'Saigon Street Food', '200 Vo Van Tan, District 3, HCMC', 106.683817, 10.775508, 4.3, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', '0901234573', 'merchant_007', 'saigon-street-food', true),
('RES008', 'Banh Mi Express', '26 Le Thi Rieng, District 1, HCMC', 106.693817, 10.770508, 4.9, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', '0901234574', 'merchant_008', 'banh-mi-express', true),
('RES009', 'Burger House', '150 Dong Khoi, District 1, HCMC', 106.704817, 10.777508, 4.6, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', '0901234575', 'merchant_009', 'burger-house', true),
('RES010', 'Taco Bell Vietnam', '88 Pasteur, District 1, HCMC', 106.692817, 10.782508, 4.5, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635233/tacos_g0bqyg.jpg', '0901234576', 'merchant_010', 'taco-bell-vietnam', true),
('RES011', 'Fried Chicken King', '45 Le Thanh Ton, District 1, HCMC', 106.699817, 10.779508, 4.7, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', '0901234577', 'merchant_011', 'fried-chicken-king', true),
('RES012', 'Healthy Bowl', '99 Nguyen Du, District 1, HCMC', 106.695817, 10.781508, 4.8, '00:01:00', '23:59:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640680/orange-juice_qynanv.jpg', '0901234578', 'merchant_012', 'healthy-bowl', true);

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
('PROD042', 'Iced Coffee', 'Vietnamese iced coffee', 'RES006', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg', 'CAT001', 4.6, 'iced-coffee', true, 0),

-- More items for The Gourmet Kitchen (RES001)
('PROD043', 'BBQ Bacon Burger', 'Beef patty with crispy bacon and BBQ sauce', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', 'CAT011', 4.7, 'bbq-bacon-burger', true, 0),
('PROD044', 'Cheese Balls', 'Deep fried cheese balls with marinara sauce', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635314/cheeseball_pibzk3.jpg', 'CAT003', 4.5, 'cheese-balls', true, 0),

-- More items for Pizza Hut Express (RES003)
('PROD045', 'Hawaiian Pizza', 'Ham and pineapple on cheese base', 'RES003', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', 'CAT010', 4.4, 'hawaiian-pizza', true, 0),
('PROD046', 'Meat Lovers Pizza', 'Pepperoni, sausage, bacon, and ham', 'RES003', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', 'CAT010', 4.8, 'meat-lovers-pizza', true, 0),

-- More items for Korean BBQ House (RES004)
('PROD047', 'Spicy Chicken Wings', 'Korean style spicy fried chicken', 'RES004', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT008', 4.6, 'korean-spicy-wings', true, 0),
('PROD048', 'Bulgogi Beef', 'Sweet marinated beef Korean style', 'RES004', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635341/gasot_opwrcw.jpg', 'CAT008', 4.8, 'bulgogi-beef', true, 0),

-- More items for Sushi Tokyo (RES005)
('PROD049', 'Tuna Sashimi', 'Premium bluefin tuna sashimi', 'RES005', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635330/daga_abs1zd.jpg', 'CAT009', 4.9, 'tuna-sashimi', true, 0),
('PROD050', 'Dragon Roll', 'Eel and avocado maki roll', 'RES005', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', 'CAT009', 4.7, 'dragon-roll', true, 0),

-- More items for Bubble Tea Cafe (RES006)
('PROD051', 'Taro Milk Tea', 'Creamy taro flavored milk tea', 'RES006', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg', 'CAT001', 4.6, 'taro-milk-tea', true, 0),
('PROD052', 'Brown Sugar Boba', 'Brown sugar milk tea with fresh boba', 'RES006', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg', 'CAT001', 4.8, 'brown-sugar-boba', true, 0),

-- More items for Saigon Street Food (RES007)
('PROD053', 'Vietnamese Spring Rolls', 'Fresh rice paper rolls with shrimp', 'RES007', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', 'CAT007', 4.5, 'vietnamese-spring-rolls', true, 0),
('PROD054', 'Grilled Beef Pho', 'Beef pho with grilled beef slices', 'RES007', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635341/gasot_opwrcw.jpg', 'CAT007', 4.7, 'grilled-beef-pho', true, 0),

-- More items for Burger House (RES009)
('PROD055', 'Mushroom Swiss Burger', 'Beef patty with sautéed mushrooms and Swiss cheese', 'RES009', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', 'CAT011', 4.6, 'mushroom-swiss-burger', true, 0),
('PROD056', 'Sweet Potato Fries', 'Crispy sweet potato fries with aioli', 'RES009', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635297/khoaitaychien_n8njn6.jpg', 'CAT003', 4.4, 'sweet-potato-fries', true, 0),

-- More items for Taco Bell Vietnam (RES010)
('PROD057', 'Steak Burrito', 'Grilled steak with rice and beans', 'RES010', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', 'CAT012', 4.8, 'steak-burrito', true, 0),
('PROD058', 'Crunchy Tacos', 'Hard shell tacos with seasoned beef', 'RES010', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635233/tacos_g0bqyg.jpg', 'CAT012', 4.5, 'crunchy-tacos', true, 0),

-- More items for Fried Chicken King (RES011)
('PROD059', 'Honey Garlic Wings', 'Sweet and savory chicken wings', 'RES011', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.7, 'honey-garlic-wings', true, 0),
('PROD060', 'Chicken Popcorn', 'Bite-sized crispy chicken pieces', 'RES011', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.5, 'chicken-popcorn', true, 0),

-- More items for Healthy Bowl (RES012)
('PROD061', 'Poke Bowl', 'Hawaiian style raw fish with rice and vegetables', 'RES012', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635330/daga_abs1zd.jpg', 'CAT013', 4.8, 'poke-bowl', true, 0),
('PROD062', 'Protein Smoothie', 'Banana, peanut butter, and protein powder', 'RES012', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640680/orange-juice_qynanv.jpg', 'CAT001', 4.6, 'protein-smoothie', true, 0),

-- New Asian dishes with new images
('PROD063', 'Bibimbap', 'Korean mixed rice bowl with vegetables, egg, and gochujang', 'RES004', 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769003940/Dolsot-bibimbap_ezbbug.jpg', 'CAT008', 4.9, 'bibimbap', true, 0),
('PROD064', 'Japanese Curry Rice', 'Traditional Japanese curry with rice, vegetables, and choice of protein', 'RES005', 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769004065/doi-gio-cho-ca-gia-dinh-voi-mon-com-ca-ri-kieu-nhat-ban-tre-em-cung-an-duoc-202007231448514435_vwfjfn.jpg', 'CAT009', 4.7, 'japanese-curry-rice', true, 0),
('PROD065', 'Tonkotsu Ramen', 'Rich pork bone broth ramen with chashu, egg, and noodles', 'RES005', 'https://res.cloudinary.com/djalvvgd0/image/upload/v1766017787/eoxnxltgruqiyf6ailvl.jpg', 'CAT009', 4.9, 'tonkotsu-ramen', true, 0),
('PROD066', 'Miso Ramen', 'Savory miso broth with tender noodles and toppings', 'RES005', 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769004152/download_qfadyi.jpg', 'CAT009', 4.8, 'miso-ramen', true, 0),
('PROD067', 'Creamy Pasta', 'Italian pasta with rich cream sauce and parmesan', 'RES003', 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769004216/2023_10_19_638333151281847208_mi-y-sot-kem_kobycn.webp', 'CAT010', 4.6, 'creamy-pasta', true, 0);

-- ============================================
-- PRODUCT SIZES (Pricing in USD)
-- ============================================
INSERT INTO product_sizes (id, product_id, size_id, price) VALUES
-- The Gourmet Kitchen
('PS001', 'PROD001', 'M', 2.20),
('PS002', 'PROD001', 'L', 3.00),
('PS003', 'PROD002', 'M', 3.40),
('PS004', 'PROD002', 'L', 4.80),
('PS005', 'PROD003', 'M', 2.60),
('PS006', 'PROD004', 'M', 1.00),
('PS007', 'PROD004', 'L', 1.40),

-- Pho Hanoi
('PS008', 'PROD005', 'M', 1.80),
('PS009', 'PROD005', 'L', 2.20),
('PS010', 'PROD006', 'M', 1.60),
('PS011', 'PROD006', 'L', 2.00),
('PS012', 'PROD007', 'M', 1.20),

-- Pizza Hut Express
('PS013', 'PROD008', 'M', 6.00),
('PS014', 'PROD008', 'L', 8.80),
('PS015', 'PROD009', 'M', 7.20),
('PS016', 'PROD009', 'L', 10.40),
('PS017', 'PROD010', 'M', 3.80),

-- Korean BBQ House
('PS018', 'PROD011', 'M', 7.56),
('PS019', 'PROD011', 'L', 11.56),
('PS020', 'PROD012', 'M', 6.76),
('PS021', 'PROD012', 'L', 9.96),
('PS022', 'PROD013', 'M', 3.16),

-- Sushi Tokyo
('PS023', 'PROD014', 'M', 4.80),
('PS024', 'PROD014', 'L', 7.20),
('PS025', 'PROD015', 'M', 10.00),
('PS026', 'PROD015', 'L', 15.20),
('PS027', 'PROD016', 'M', 3.40),

-- Bubble Tea Cafe
('PS028', 'PROD017', 'M', 1.40),
('PS029', 'PROD017', 'L', 1.80),
('PS030', 'PROD018', 'M', 1.60),
('PS031', 'PROD018', 'L', 2.00),
('PS032', 'PROD019', 'M', 1.80),
('PS033', 'PROD019', 'L', 2.20),

-- Saigon Street Food
('PS034', 'PROD020', 'M', 1.80),
('PS035', 'PROD020', 'L', 2.40),
('PS036', 'PROD021', 'M', 1.60),
('PS037', 'PROD021', 'L', 2.20),

-- Banh Mi Express
('PS038', 'PROD022', 'M', 1.80),
('PS039', 'PROD023', 'M', 1.60),

-- Burger House
('PS040', 'PROD024', 'M', 3.40),
('PS041', 'PROD024', 'L', 4.40),
('PS042', 'PROD025', 'M', 2.60),
('PS043', 'PROD025', 'L', 3.40),
('PS044', 'PROD026', 'M', 2.40),
('PS045', 'PROD027', 'M', 1.20),

-- Taco Bell
('PS046', 'PROD028', 'M', 1.92),
('PS047', 'PROD028', 'L', 2.60),
('PS048', 'PROD029', 'M', 2.08),
('PS049', 'PROD029', 'L', 2.80),
('PS050', 'PROD030', 'M', 2.20),
('PS051', 'PROD030', 'L', 3.00),
('PS052', 'PROD031', 'M', 1.80),

-- Fried Chicken King
('PS053', 'PROD032', 'M', 2.60),
('PS054', 'PROD032', 'L', 3.80),
('PS055', 'PROD033', 'M', 2.80),
('PS056', 'PROD033', 'L', 4.00),
('PS057', 'PROD034', 'M', 2.40),
('PS058', 'PROD035', 'M', 0.80),

-- Healthy Bowl
('PS059', 'PROD036', 'M', 3.40),
('PS060', 'PROD036', 'L', 4.40),
('PS061', 'PROD037', 'M', 3.80),
('PS062', 'PROD037', 'L', 5.20),
('PS063', 'PROD038', 'M', 3.00),
('PS064', 'PROD039', 'M', 1.80),
('PS065', 'PROD039', 'L', 2.40),

-- Beverages
('PS066', 'PROD040', 'M', 0.60),
('PS067', 'PROD041', 'M', 0.80),
('PS068', 'PROD042', 'M', 1.00),
('PS069', 'PROD042', 'L', 1.40),

-- The Gourmet Kitchen - Additional items
('PS070', 'PROD043', 'M', 3.20),
('PS071', 'PROD043', 'L', 4.20),
('PS072', 'PROD044', 'M', 1.80),

-- Pizza Hut Express - Additional items
('PS073', 'PROD045', 'M', 6.40),
('PS074', 'PROD045', 'L', 9.20),
('PS075', 'PROD046', 'M', 7.60),
('PS076', 'PROD046', 'L', 11.00),

-- Korean BBQ House - Additional items
('PS077', 'PROD047', 'M', 3.20),
('PS078', 'PROD047', 'L', 4.40),
('PS079', 'PROD048', 'M', 8.00),
('PS080', 'PROD048', 'L', 12.00),

-- Sushi Tokyo - Additional items
('PS081', 'PROD049', 'M', 12.00),
('PS082', 'PROD049', 'L', 18.00),
('PS083', 'PROD050', 'M', 4.20),

-- Bubble Tea Cafe - Additional items
('PS084', 'PROD051', 'M', 1.60),
('PS085', 'PROD051', 'L', 2.00),
('PS086', 'PROD052', 'M', 1.80),
('PS087', 'PROD052', 'L', 2.40),

-- Saigon Street Food - Additional items
('PS088', 'PROD053', 'M', 1.40),
('PS089', 'PROD054', 'M', 2.00),
('PS090', 'PROD054', 'L', 2.60),

-- Burger House - Additional items
('PS091', 'PROD055', 'M', 3.60),
('PS092', 'PROD055', 'L', 4.80),
('PS093', 'PROD056', 'M', 1.40),
('PS094', 'PROD056', 'L', 1.80),

-- Taco Bell - Additional items
('PS095', 'PROD057', 'M', 2.40),
('PS096', 'PROD057', 'L', 3.20),
('PS097', 'PROD058', 'M', 1.80),
('PS098', 'PROD058', 'L', 2.40),

-- Fried Chicken King - Additional items
('PS099', 'PROD059', 'M', 3.00),
('PS100', 'PROD059', 'L', 4.20),
('PS101', 'PROD060', 'M', 2.20),

-- Healthy Bowl - Additional items
('PS102', 'PROD061', 'M', 4.00),
('PS103', 'PROD061', 'L', 5.60),
('PS104', 'PROD062', 'M', 2.00),
('PS105', 'PROD062', 'L', 2.80),

-- New Asian dishes
('PS106', 'PROD063', 'M', 4.20),
('PS107', 'PROD063', 'L', 5.80),
('PS108', 'PROD064', 'M', 3.60),
('PS109', 'PROD064', 'L', 4.80),
('PS110', 'PROD065', 'M', 4.40),
('PS111', 'PROD065', 'L', 6.00),
('PS112', 'PROD066', 'M', 4.20),
('PS113', 'PROD066', 'L', 5.60),
('PS114', 'PROD067', 'M', 4.00),
('PS115', 'PROD067', 'L', 5.40);

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
