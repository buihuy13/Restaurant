-- ============================================
-- SEED DATA FOR RESTAURANT PROJECT
-- Run after main.sql has been executed
-- ============================================

USE `restaurant-service`;

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (id, cate_name) VALUES
('CAT001', 'Do uong'),
('CAT002', 'Mon chinh'),
('CAT003', 'Mon phu'),
('CAT004', 'Trang mieng'),
('CAT005', 'Do an nhanh'),
('CAT006', 'Mon chay'),
('CAT007', 'Mon Viet'),
('CAT008', 'Mon Han'),
('CAT009', 'Mon Nhat'),
('CAT010', 'Pizza & Pasta');

-- ============================================
-- SIZES
-- ============================================
INSERT INTO size (id, name) VALUES
('S', 'Nho'),
('M', 'Vua'),
('L', 'Lon'),
('XL', 'Sieu lon');

-- ============================================
-- RESTAURANTS
-- ============================================
INSERT INTO restaurants (id, res_name, address, longitude, latitude, rating, opening_time, closing_time, image_url, phone, merchant_id, slug, enabled) VALUES
('RES001', 'Pho Ha Noi', '123 Nguyen Hue, Q1, TP.HCM', 106.701317, 10.775658, 4.5, '06:00:00', '22:00:00', 'https://res.cloudinary.com/demo/image/upload/pho.jpg', '0901234567', 'testmerchantid', 'pho-ha-noi', true),
('RES002', 'Bun Cha Obama', '456 Le Loi, Q1, TP.HCM', 106.698316, 10.773852, 4.8, '07:00:00', '21:00:00', 'https://res.cloudinary.com/demo/image/upload/buncha.jpg', '0901234568', 'testmerchantid', 'bun-cha-obama', true),
('RES003', 'Pizza Hut Express', '789 Tran Hung Dao, Q5, TP.HCM', 106.680088, 10.754292, 4.2, '10:00:00', '23:00:00', 'https://res.cloudinary.com/demo/image/upload/pizza.jpg', '0901234569', 'testmerchantid', 'pizza-hut-express', true),
('RES004', 'Korean BBQ House', '321 Pasteur, Q3, TP.HCM', 106.690167, 10.784308, 4.6, '11:00:00', '23:00:00', 'https://res.cloudinary.com/demo/image/upload/kbbq.jpg', '0901234570', 'testmerchantid', 'korean-bbq-house', true),
('RES005', 'Sushi Tokyo', '555 Hai Ba Trung, Q1, TP.HCM', 106.696817, 10.788508, 4.7, '10:00:00', '22:00:00', 'https://res.cloudinary.com/demo/image/upload/sushi.jpg', '0901234571', 'testmerchantid', 'sushi-tokyo', true),
('RES006', 'Tra Sua Gong Cha', '100 Nguyen Thi Minh Khai, Q3, TP.HCM', 106.686817, 10.780508, 4.4, '08:00:00', '22:00:00', 'https://res.cloudinary.com/demo/image/upload/trasua.jpg', '0901234572', 'testmerchantid', 'tra-sua-gong-cha', true),
('RES007', 'Com Tam Sai Gon', '200 Vo Van Tan, Q3, TP.HCM', 106.683817, 10.775508, 4.3, '06:00:00', '21:00:00', 'https://res.cloudinary.com/demo/image/upload/comtam.jpg', '0901234573', 'testmerchantid', 'com-tam-sai-gon', true),
('RES008', 'Banh Mi Huynh Hoa', '26 Le Thi Rieng, Q1, TP.HCM', 106.693817, 10.770508, 4.9, '06:00:00', '23:00:00', 'https://res.cloudinary.com/demo/image/upload/banhmi.jpg', '0901234574', 'testmerchantid', 'banh-mi-huynh-hoa', true);

-- ============================================
-- RESTAURANT CATEGORIES
-- ============================================
INSERT INTO restaurant_categories (restaurant_id, category_id) VALUES
('RES001', 'CAT007'),
('RES001', 'CAT002'),
('RES002', 'CAT007'),
('RES002', 'CAT002'),
('RES003', 'CAT010'),
('RES003', 'CAT005'),
('RES004', 'CAT008'),
('RES004', 'CAT002'),
('RES005', 'CAT009'),
('RES005', 'CAT002'),
('RES006', 'CAT001'),
('RES007', 'CAT007'),
('RES007', 'CAT002'),
('RES008', 'CAT005'),
('RES008', 'CAT007');

-- ============================================
-- PRODUCTS
-- ============================================
INSERT INTO products (id, product_name, description, restaurant_id, image_url, category_id, rating, slug, available, total_review) VALUES
-- Pho Ha Noi
('PROD001', 'Pho Bo Tai', 'Pho bo tai voi nuoc dung dam da, thit bo tai mem', 'RES001', 'https://res.cloudinary.com/demo/image/upload/phobo.jpg', 'CAT002', 4.5, 'pho-bo-tai', true, 0),
('PROD002', 'Pho Bo Chin', 'Pho bo chin voi thit bo chin mem, nuoc dung ngot thanh', 'RES001', 'https://res.cloudinary.com/demo/image/upload/phobochin.jpg', 'CAT002', 4.3, 'pho-bo-chin', true, 0),
('PROD003', 'Pho Ga', 'Pho ga voi thit ga ta, nuoc dung trong', 'RES001', 'https://res.cloudinary.com/demo/image/upload/phoga.jpg', 'CAT002', 4.6, 'pho-ga', true, 0),

-- Bun Cha Obama
('PROD004', 'Bun Cha Dac Biet', 'Bun cha dac biet voi cha vien, cha mieng, thit nuong', 'RES002', 'https://res.cloudinary.com/demo/image/upload/buncha.jpg', 'CAT002', 4.8, 'bun-cha-dac-biet', true, 0),
('PROD005', 'Bun Cha Thuong', 'Bun cha voi cha nuong thom lung', 'RES002', 'https://res.cloudinary.com/demo/image/upload/bunchath.jpg', 'CAT002', 4.5, 'bun-cha-thuong', true, 0),
('PROD006', 'Nem Ran', 'Nem ran gion rum, nhan thit heo', 'RES002', 'https://res.cloudinary.com/demo/image/upload/nemran.jpg', 'CAT003', 4.4, 'nem-ran', true, 0),

-- Pizza Hut Express
('PROD007', 'Pizza Pepperoni', 'Pizza pepperoni voi xuc xich Y, pho mai mozzarella', 'RES003', 'https://res.cloudinary.com/demo/image/upload/pepperoni.jpg', 'CAT010', 4.3, 'pizza-pepperoni', true, 0),
('PROD008', 'Pizza Hai San', 'Pizza hai san voi tom, muc, so diep', 'RES003', 'https://res.cloudinary.com/demo/image/upload/seafood.jpg', 'CAT010', 4.5, 'pizza-hai-san', true, 0),
('PROD009', 'Pasta Carbonara', 'Mi Y sot kem trung, bacon', 'RES003', 'https://res.cloudinary.com/demo/image/upload/carbonara.jpg', 'CAT010', 4.2, 'pasta-carbonara', true, 0),

-- Korean BBQ House
('PROD010', 'Thit Bo Nuong Han Quoc', 'Thit bo nuong kieu Han voi sot dac biet', 'RES004', 'https://res.cloudinary.com/demo/image/upload/bulgogi.jpg', 'CAT008', 4.7, 'thit-bo-nuong-han-quoc', true, 0),
('PROD011', 'Samgyeopsal', 'Thit ba chi nuong Han Quoc', 'RES004', 'https://res.cloudinary.com/demo/image/upload/samgyeopsal.jpg', 'CAT008', 4.6, 'samgyeopsal', true, 0),
('PROD012', 'Kimchi Jjigae', 'Canh kim chi cay nong', 'RES004', 'https://res.cloudinary.com/demo/image/upload/kimchi.jpg', 'CAT008', 4.4, 'kimchi-jjigae', true, 0),

-- Sushi Tokyo
('PROD013', 'Sushi Ca Hoi', 'Sushi ca hoi tuoi nhap khau', 'RES005', 'https://res.cloudinary.com/demo/image/upload/salmon.jpg', 'CAT009', 4.8, 'sushi-ca-hoi', true, 0),
('PROD014', 'Sashimi Tong Hop', 'Sashimi tong hop ca hoi, ca ngu, bach tuoc', 'RES005', 'https://res.cloudinary.com/demo/image/upload/sashimi.jpg', 'CAT009', 4.9, 'sashimi-tong-hop', true, 0),
('PROD015', 'Maki Roll', 'Maki roll California', 'RES005', 'https://res.cloudinary.com/demo/image/upload/maki.jpg', 'CAT009', 4.5, 'maki-roll', true, 0),

-- Tra Sua Gong Cha
('PROD016', 'Tra Sua Truyen Thong', 'Tra sua truyen thong voi tran chau den', 'RES006', 'https://res.cloudinary.com/demo/image/upload/milktea.jpg', 'CAT001', 4.5, 'tra-sua-truyen-thong', true, 0),
('PROD017', 'Tra Dao Cam Sa', 'Tra dao cam sa thanh mat', 'RES006', 'https://res.cloudinary.com/demo/image/upload/peachtea.jpg', 'CAT001', 4.6, 'tra-dao-cam-sa', true, 0),
('PROD018', 'Matcha Latte', 'Matcha latte beo ngay', 'RES006', 'https://res.cloudinary.com/demo/image/upload/matcha.jpg', 'CAT001', 4.4, 'matcha-latte', true, 0),

-- Com Tam Sai Gon
('PROD019', 'Com Tam Suon Bi Cha', 'Com tam suon bi cha day du', 'RES007', 'https://res.cloudinary.com/demo/image/upload/comtam.jpg', 'CAT007', 4.5, 'com-tam-suon-bi-cha', true, 0),
('PROD020', 'Com Tam Suon Nuong', 'Com tam suon nuong thom lung', 'RES007', 'https://res.cloudinary.com/demo/image/upload/comtamsuon.jpg', 'CAT007', 4.4, 'com-tam-suon-nuong', true, 0),

-- Banh Mi Huynh Hoa
('PROD021', 'Banh Mi Dac Biet', 'Banh mi dac biet voi pate, thit nguoi, cha lua', 'RES008', 'https://res.cloudinary.com/demo/image/upload/banhmi.jpg', 'CAT005', 4.9, 'banh-mi-dac-biet', true, 0),
('PROD022', 'Banh Mi Thit Nuong', 'Banh mi thit nuong voi nuoc sot dac biet', 'RES008', 'https://res.cloudinary.com/demo/image/upload/banhmithit.jpg', 'CAT005', 4.7, 'banh-mi-thit-nuong', true, 0);

-- ============================================
-- PRODUCT SIZES
-- ============================================
INSERT INTO product_sizes (id, product_id, size_id, price) VALUES
-- Pho
('PS001', 'PROD001', 'M', 45000),
('PS002', 'PROD001', 'L', 55000),
('PS003', 'PROD002', 'M', 45000),
('PS004', 'PROD002', 'L', 55000),
('PS005', 'PROD003', 'M', 40000),
('PS006', 'PROD003', 'L', 50000),
-- Bun Cha
('PS007', 'PROD004', 'M', 50000),
('PS008', 'PROD004', 'L', 65000),
('PS009', 'PROD005', 'M', 40000),
('PS010', 'PROD005', 'L', 50000),
('PS011', 'PROD006', 'M', 30000),
-- Pizza
('PS012', 'PROD007', 'M', 150000),
('PS013', 'PROD007', 'L', 220000),
('PS014', 'PROD008', 'M', 180000),
('PS015', 'PROD008', 'L', 260000),
('PS016', 'PROD009', 'M', 95000),
-- Korean BBQ
('PS017', 'PROD010', 'M', 189000),
('PS018', 'PROD010', 'L', 289000),
('PS019', 'PROD011', 'M', 169000),
('PS020', 'PROD011', 'L', 249000),
('PS021', 'PROD012', 'M', 79000),
-- Sushi
('PS022', 'PROD013', 'M', 120000),
('PS023', 'PROD013', 'L', 180000),
('PS024', 'PROD014', 'M', 250000),
('PS025', 'PROD014', 'L', 380000),
('PS026', 'PROD015', 'M', 85000),
-- Tra Sua
('PS027', 'PROD016', 'M', 35000),
('PS028', 'PROD016', 'L', 45000),
('PS029', 'PROD017', 'M', 40000),
('PS030', 'PROD017', 'L', 50000),
('PS031', 'PROD018', 'M', 45000),
('PS032', 'PROD018', 'L', 55000),
-- Com Tam
('PS033', 'PROD019', 'M', 45000),
('PS034', 'PROD019', 'L', 60000),
('PS035', 'PROD020', 'M', 40000),
('PS036', 'PROD020', 'L', 55000),
-- Banh Mi
('PS037', 'PROD021', 'M', 45000),
('PS038', 'PROD022', 'M', 40000);

-- ============================================
-- REVIEWS
-- ============================================
INSERT INTO reviews (id, title, content, rating, review_id, review_type, user_id) VALUES
('REV001', 'Pho ngon tuyet!', 'Nuoc dung dam da, thit bo tuoi ngon. Se quay lai!', 5.0, 'RES001', 'RESTAURANT', 'testuserid'),
('REV002', 'Bun cha dung vi Ha Noi', 'Cha nuong thom, nuoc mam pha chuan vi Bac', 4.8, 'RES002', 'RESTAURANT', 'user_gen_01'),
('REV003', 'Pizza ngon nhung hoi lau', 'Pizza ngon, pho mai nhieu. Nhung doi hoi lau', 4.0, 'RES003', 'RESTAURANT', 'user_gen_02'),
('REV004', 'Sushi sieu tuoi', 'Ca hoi tuoi, tan trong mieng. Dang dong tien!', 5.0, 'RES005', 'RESTAURANT', 'user_gen_03'),
('REV005', 'Tra sua ngon', 'Tra thom, tran chau deo. Gia hop ly', 4.5, 'RES006', 'RESTAURANT', 'user_gen_04');

-- ============================================
-- CHAT SERVICE
-- ============================================
USE `chat-service`;

INSERT INTO chat_rooms (id, user1_id, user2_id, last_message) VALUES
('ROOM001', 'testuserid', 'testmerchantid', 'Xin chao, toi muon dat mon'),
('ROOM002', 'user_gen_01', 'testmerchantid', 'Nha hang con mo cua khong?');

INSERT INTO messages (id, sender_id, receiver_id, content, room_id, `is_read`) VALUES
('MSG001', 'testuserid', 'testmerchantid', 'Xin chao, toi muon dat mon', 'ROOM001', true),
('MSG002', 'testmerchantid', 'testuserid', 'Da chao anh/chi, anh/chi muon dat mon gi a?', 'ROOM001', true),
('MSG003', 'testuserid', 'testmerchantid', 'Cho toi 1 phan Pho Bo Tai size L', 'ROOM001', false),
('MSG004', 'user_gen_01', 'testmerchantid', 'Nha hang con mo cua khong?', 'ROOM002', true),
('MSG005', 'testmerchantid', 'user_gen_01', 'Da nha hang mo cua den 22h a', 'ROOM002', false);
