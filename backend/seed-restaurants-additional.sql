-- ============================================
-- ADDITIONAL RESTAURANT DATA
-- Run this after main_postgres.sql
-- ============================================

-- Add categories for new restaurants
INSERT INTO restaurant_categories (restaurant_id, category_id) VALUES
-- The Gourmet Kitchen (RES001)
('RES001', 'CAT011'),  -- American
('RES001', 'CAT005'),  -- Fast Food
-- Burger House (RES009)
('RES009', 'CAT011'),  -- American
('RES009', 'CAT005'),  -- Fast Food
-- Taco Bell Vietnam (RES010)
('RES010', 'CAT012'),  -- Mexican
('RES010', 'CAT005'),  -- Fast Food
-- Fried Chicken King (RES011)
('RES011', 'CAT011'),  -- American
('RES011', 'CAT005'),  -- Fast Food
-- Healthy Bowl (RES012)
('RES012', 'CAT013'),  -- Healthy
('RES012', 'CAT006');  -- Vegetarian

-- ============================================
-- PRODUCTS FOR NEW RESTAURANTS
-- ============================================

INSERT INTO products (id, product_name, description, restaurant_id, image_url, category_id, rating, slug, available, total_review) VALUES
-- The Gourmet Kitchen (RES001)
('PROD023', 'Classic Burger', 'Juicy beef patty with fresh lettuce, tomato, and special sauce', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', 'CAT011', 4.6, 'classic-burger-gourmet', true, 0),
('PROD024', 'Margherita Pizza', 'Fresh mozzarella, tomato sauce, and basil on thin crust', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', 'CAT010', 4.5, 'margherita-pizza-gourmet', true, 0),
('PROD025', 'Grilled Chicken Sandwich', 'Grilled chicken breast with avocado and chipotle mayo', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.7, 'grilled-chicken-sandwich', true, 0),
('PROD026', 'French Fries', 'Crispy golden fries with sea salt', 'RES001', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635297/khoaitaychien_n8njn6.jpg', 'CAT003', 4.4, 'french-fries-gourmet', true, 0),

-- Burger House (RES009)
('PROD027', 'Double Cheeseburger', 'Two beef patties with double cheese and bacon', 'RES009', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', 'CAT011', 4.8, 'double-cheeseburger', true, 0),
('PROD028', 'Chicken Burger', 'Crispy fried chicken with coleslaw and mayo', 'RES009', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.5, 'chicken-burger-house', true, 0),
('PROD029', 'Veggie Burger', 'Plant-based patty with grilled vegetables', 'RES009', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', 'CAT006', 4.3, 'veggie-burger', true, 0),
('PROD030', 'Onion Rings', 'Crispy beer-battered onion rings', 'RES009', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635297/khoaitaychien_n8njn6.jpg', 'CAT003', 4.2, 'onion-rings', true, 0),

-- Taco Bell Vietnam (RES010)
('PROD031', 'Beef Tacos', 'Three soft tacos with seasoned beef, lettuce, and cheese', 'RES010', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635233/tacos_g0bqyg.jpg', 'CAT012', 4.6, 'beef-tacos-bell', true, 0),
('PROD032', 'Chicken Burrito', 'Grilled chicken with rice, beans, and salsa wrapped in tortilla', 'RES010', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg', 'CAT012', 4.7, 'chicken-burrito-bell', true, 0),
('PROD033', 'Nachos Supreme', 'Tortilla chips with cheese, beef, sour cream, and jalapeños', 'RES010', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635297/khoaitaychien_n8njn6.jpg', 'CAT012', 4.5, 'nachos-supreme', true, 0),
('PROD034', 'Quesadilla', 'Grilled tortilla with melted cheese and chicken', 'RES010', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', 'CAT012', 4.4, 'quesadilla-bell', true, 0),

-- Fried Chicken King (RES011)
('PROD035', 'Original Fried Chicken', 'Crispy fried chicken with secret 11 herbs and spices', 'RES011', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.8, 'original-fried-chicken', true, 0),
('PROD036', 'Spicy Chicken Wings', 'Hot and spicy chicken wings with ranch dip', 'RES011', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.7, 'spicy-chicken-wings', true, 0),
('PROD037', 'Chicken Tenders', 'Breaded chicken tenders with honey mustard', 'RES011', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT011', 4.6, 'chicken-tenders', true, 0),
('PROD038', 'Coleslaw', 'Fresh creamy coleslaw', 'RES011', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', 'CAT003', 4.3, 'coleslaw', true, 0),

-- Healthy Bowl (RES012)
('PROD039', 'Quinoa Buddha Bowl', 'Quinoa with roasted vegetables, avocado, and tahini dressing', 'RES012', 'https://res.cloudinary.com/demo/image/upload/buddha-bowl.jpg', 'CAT013', 4.9, 'quinoa-buddha-bowl', true, 0),
('PROD040', 'Grilled Salmon Salad', 'Fresh salmon with mixed greens and lemon vinaigrette', 'RES012', 'https://res.cloudinary.com/demo/image/upload/salmon-salad.jpg', 'CAT013', 4.8, 'grilled-salmon-salad', true, 0),
('PROD041', 'Acai Bowl', 'Acai berries with granola, banana, and honey', 'RES012', 'https://res.cloudinary.com/demo/image/upload/acai-bowl.jpg', 'CAT013', 4.7, 'acai-bowl', true, 0),
('PROD042', 'Green Smoothie', 'Spinach, kale, banana, and almond milk', 'RES012', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', 'CAT001', 4.6, 'green-smoothie', true, 0);

-- ============================================
-- PRODUCT SIZES FOR NEW PRODUCTS
-- ============================================

INSERT INTO product_sizes (id, product_id, size_id, price) VALUES
-- The Gourmet Kitchen
('PS039', 'PROD023', 'M', 55000),
('PS040', 'PROD023', 'L', 75000),
('PS041', 'PROD024', 'M', 85000),
('PS042', 'PROD024', 'L', 120000),
('PS043', 'PROD025', 'M', 65000),
('PS044', 'PROD026', 'M', 25000),
('PS045', 'PROD026', 'L', 35000),

-- Burger House
('PS046', 'PROD027', 'M', 85000),
('PS047', 'PROD027', 'L', 110000),
('PS048', 'PROD028', 'M', 65000),
('PS049', 'PROD028', 'L', 85000),
('PS050', 'PROD029', 'M', 60000),
('PS051', 'PROD030', 'M', 30000),

-- Taco Bell
('PS052', 'PROD031', 'M', 48000),
('PS053', 'PROD031', 'L', 65000),
('PS054', 'PROD032', 'M', 52000),
('PS055', 'PROD032', 'L', 70000),
('PS056', 'PROD033', 'M', 55000),
('PS057', 'PROD033', 'L', 75000),
('PS058', 'PROD034', 'M', 45000),

-- Fried Chicken King
('PS059', 'PROD035', 'M', 65000),
('PS060', 'PROD035', 'L', 95000),
('PS061', 'PROD036', 'M', 70000),
('PS062', 'PROD036', 'L', 100000),
('PS063', 'PROD037', 'M', 60000),
('PS064', 'PROD038', 'M', 20000),

-- Healthy Bowl
('PS065', 'PROD039', 'M', 85000),
('PS066', 'PROD039', 'L', 110000),
('PS067', 'PROD040', 'M', 95000),
('PS068', 'PROD040', 'L', 130000),
('PS069', 'PROD041', 'M', 75000),
('PS070', 'PROD042', 'M', 45000),
('PS071', 'PROD042', 'L', 60000);

-- ============================================
-- ADDITIONAL REVIEWS
-- ============================================

INSERT INTO reviews (id, title, content, rating, review_id, review_type, user_id) VALUES
('REV006', 'Best burger in town!', 'The Classic Burger is amazing! Juicy and flavorful.', 5.0, 'RES001', 'RESTAURANT', 'user_gen_05'),
('REV007', 'Great variety', 'Love the menu variety at The Gourmet Kitchen', 4.5, 'RES001', 'RESTAURANT', 'user_gen_06'),
('REV008', 'Double Cheeseburger heaven', 'Best double cheeseburger I have ever had!', 5.0, 'RES009', 'RESTAURANT', 'user_gen_07'),
('REV009', 'Authentic Mexican taste', 'Tacos taste just like in Mexico. Highly recommend!', 4.8, 'RES010', 'RESTAURANT', 'user_gen_08'),
('REV010', 'Crispy and delicious', 'Fried chicken is perfectly crispy. Will order again!', 4.9, 'RES011', 'RESTAURANT', 'user_gen_09'),
('REV011', 'Healthy and tasty', 'Finally a healthy option that actually tastes good!', 5.0, 'RES012', 'RESTAURANT', 'user_gen_10'),
('REV012', 'Perfect for diet', 'Quinoa Buddha Bowl is my favorite. So nutritious!', 4.8, 'RES012', 'RESTAURANT', 'testuserid');
