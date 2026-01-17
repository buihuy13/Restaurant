-- Connect to the database
\c restaurant-service;

-- Enable PostGIS for this database
CREATE EXTENSION IF NOT EXISTS postgis;

-- Categories table
CREATE TABLE categories (
    id VARCHAR(10) PRIMARY KEY,
    cate_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE restaurants (
    id VARCHAR(255) PRIMARY KEY,
    res_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326), -- PostGIS geometry column
    rating REAL,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    image_url VARCHAR(255),
    public_id VARCHAR(255),
    phone VARCHAR(15),
    total_review INTEGER DEFAULT 0,
    merchant_id VARCHAR(100) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    enabled BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index for geom (CRITICAL for performance!)
CREATE INDEX idx_restaurants_geom_geog 
ON restaurants 
USING GIST ((geom::geography));

-- Other indexes
CREATE INDEX idx_restaurants_rating ON restaurants(rating);
CREATE INDEX idx_restaurants_merchant ON restaurants(merchant_id);
CREATE INDEX idx_restaurants_enabled ON restaurants(enabled);
CREATE INDEX idx_restaurants_slug ON restaurants(slug);

-- Trigger to auto-update geom from lat/lon
CREATE OR REPLACE FUNCTION update_restaurant_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restaurants_geom_trigger
BEFORE INSERT OR UPDATE OF longitude, latitude ON restaurants
FOR EACH ROW
EXECUTE FUNCTION update_restaurant_geom();

CREATE TABLE restaurant_categories (
    restaurant_id VARCHAR(255) NOT NULL,
    category_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (restaurant_id, category_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE INDEX idx_restaurant_categories_restaurant ON restaurant_categories(restaurant_id);
CREATE INDEX idx_restaurant_categories_category ON restaurant_categories(category_id);

CREATE TABLE size (
    id VARCHAR(5) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    image_url VARCHAR(255),
    public_id VARCHAR(255),
    category_id VARCHAR(10) NOT NULL REFERENCES categories(id),
    total_review INTEGER DEFAULT 0,
    rating REAL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    available BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for products
CREATE INDEX idx_products_restaurant ON products(restaurant_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_products_slug ON products(slug);


CREATE TABLE product_sizes (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    size_id VARCHAR(10) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES size(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_sizes_product ON product_sizes(product_id);
CREATE INDEX idx_product_sizes_size ON product_sizes(size_id);

CREATE TABLE reviews (
    id VARCHAR(200) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating REAL,
    review_id VARCHAR(255) NOT NULL,
    review_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_review INTEGER,
    user_id VARCHAR(100) NOT NULL
);

CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_review ON reviews(review_id);
CREATE INDEX idx_reviews_type ON reviews(review_type);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Helper function: Get nearby restaurants
CREATE OR REPLACE FUNCTION get_nearby_restaurants(
    user_latitude DOUBLE PRECISION,
    user_longitude DOUBLE PRECISION,
    radius_meters INTEGER DEFAULT 5000,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    id VARCHAR,
    res_name VARCHAR,
    address VARCHAR,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    rating REAL,
    distance_meters DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.res_name,
        r.address,
        r.latitude,
        r.longitude,
        r.rating,
        ST_Distance(
            r.geom::geography,
            ST_SetSRID(ST_MakePoint(user_longitude, user_latitude), 4326)::geography
        ) AS distance_meters
    FROM restaurants r
    WHERE 
        r.enabled = true
        AND ST_DWithin(
            r.geom::geography,
            ST_SetSRID(ST_MakePoint(user_longitude, user_latitude), 4326)::geography,
            radius_meters
        )
    ORDER BY distance_meters
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Fake data

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

-- ============================================
-- SIZES
-- ============================================
INSERT INTO size (id, name) VALUES
('S', 'Small'),
('M', 'Medium'),
('L', 'Large'),
('XL', 'Extra Large');

-- ============================================
-- RESTAURANTS
-- ============================================
INSERT INTO restaurants (id, res_name, address, longitude, latitude, rating, opening_time, closing_time, image_url, phone, merchant_id, slug, enabled) VALUES
('RES001', 'The Gourmet Kitchen', '123 Nguyen Hue, District 1, HCMC', 106.701317, 10.775658, 4.5, '10:00:00', '22:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', '0901234567', 'testmerchantid', 'the-gourmet-kitchen', true),
('RES002', 'Pho Hanoi', '456 Le Loi, District 1, HCMC', 106.698316, 10.773852, 4.8, '06:00:00', '21:00:00', 'https://res.cloudinary.com/demo/image/upload/pho.jpg', '0901234568', 'merchant_002', 'pho-hanoi', true),
('RES003', 'Pizza Hut Express', '789 Tran Hung Dao, District 5, HCMC', 106.680088, 10.754292, 4.2, '10:00:00', '23:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg', '0901234569', 'merchant_003', 'pizza-hut-express', true),
('RES004', 'Korean BBQ House', '321 Pasteur, District 3, HCMC', 106.690167, 10.784308, 4.6, '11:00:00', '23:00:00', 'https://res.cloudinary.com/demo/image/upload/kbbq.jpg', '0901234570', 'merchant_004', 'korean-bbq-house', true),
('RES005', 'Sushi Tokyo', '555 Hai Ba Trung, District 1, HCMC', 106.696817, 10.788508, 4.7, '10:00:00', '22:00:00', 'https://res.cloudinary.com/demo/image/upload/sushi.jpg', '0901234571', 'merchant_005', 'sushi-tokyo', true),
('RES006', 'Bubble Tea Cafe', '100 Nguyen Thi Minh Khai, District 3, HCMC', 106.686817, 10.780508, 4.4, '08:00:00', '22:00:00', 'https://res.cloudinary.com/demo/image/upload/trasua.jpg', '0901234572', 'merchant_006', 'bubble-tea-cafe', true),
('RES007', 'Saigon Street Food', '200 Vo Van Tan, District 3, HCMC', 106.683817, 10.775508, 4.3, '06:00:00', '21:00:00', 'https://res.cloudinary.com/demo/image/upload/comtam.jpg', '0901234573', 'merchant_007', 'saigon-street-food', true),
('RES008', 'Banh Mi Express', '26 Le Thi Rieng, District 1, HCMC', 106.693817, 10.770508, 4.9, '06:00:00', '23:00:00', 'https://res.cloudinary.com/demo/image/upload/banhmi.jpg', '0901234574', 'merchant_008', 'banh-mi-express', true),
('RES009', 'Burger House', '150 Dong Khoi, District 1, HCMC', 106.704817, 10.777508, 4.6, '10:00:00', '23:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg', '0901234575', 'merchant_009', 'burger-house', true),
('RES010', 'Taco Bell Vietnam', '88 Pasteur, District 1, HCMC', 106.692817, 10.782508, 4.5, '11:00:00', '22:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635233/tacos_g0bqyg.jpg', '0901234576', 'merchant_010', 'taco-bell-vietnam', true),
('RES011', 'Fried Chicken King', '45 Le Thanh Ton, District 1, HCMC', 106.699817, 10.779508, 4.7, '10:00:00', '23:00:00', 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg', '0901234577', 'merchant_011', 'fried-chicken-king', true),
('RES012', 'Healthy Bowl', '99 Nguyen Du, District 1, HCMC', 106.695817, 10.781508, 4.8, '07:00:00', '21:00:00', 'https://res.cloudinary.com/demo/image/upload/healthy-food.jpg', '0901234578', 'merchant_012', 'healthy-bowl', true);

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