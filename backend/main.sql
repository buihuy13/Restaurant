drop database if exists `user-service`;
create database if not exists `user-service`;
use `user-service`;

create table users (
    id varchar(100) primary key,
    username varchar(255) not null,
    email varchar(255) not null unique,
    `password` varchar(255),
    `role` varchar(10) not null,
    `enabled` boolean not null,
    verification_code varchar(255),
    phone varchar(15),
    slug varchar(255) not null unique,
    auth_provider varchar(20) default 'LOCAL',
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    activated_at timestamp
);

create index idx_email on users(email);

insert into users(id, `password`, username, email, phone, `role`, `enabled`, `verification_code`, `slug`) values 
("testadminid", "$2a$12$wM4Ceu0iK51euorKqByokuN7nBveBDdmXA6AgH3e5d7uVi.E0qm0a", "testadmin", "testadmin@gmail.com", "0762612698", "ADMIN", true, "abcxyz123", "abcxyz"),
("testuserid", "$2a$12$CdzbDC327zy/.up8.yloReJTMtWtqvSxThDkmfj3tVbe9B0QOJecK", "testuser", "testuser@gmail.com", "0762612699", "USER", true, "abcxyz456", "abc"),
("testmerchantid", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "testmerchant", "testmerchant@gmail.com", "0762612697", "MERCHANT", true, "abcxyz789", "xyz"),
("merchant_seafood", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_seafood", "seafood@gmail.com", "0901000101", "MERCHANT", true, "verify_seafood", "merchant-seafood"),
("merchant_coffee", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_coffee", "coffee@gmail.com", "0901000102", "MERCHANT", true, "verify_coffee", "merchant-coffee"),
("merchant_dessert", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_dessert", "dessert@gmail.com", "0901000103", "MERCHANT", true, "verify_dessert", "merchant-dessert"),
("merchant_002", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_002", "merchant002@gmail.com", "0901000002", "MERCHANT", true, "verify_002", "merchant-002"),
("merchant_003", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_003", "merchant003@gmail.com", "0901000003", "MERCHANT", true, "verify_003", "merchant-003"),
("merchant_004", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_004", "merchant004@gmail.com", "0901000004", "MERCHANT", true, "verify_004", "merchant-004"),
("merchant_005", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_005", "merchant005@gmail.com", "0901000005", "MERCHANT", true, "verify_005", "merchant-005"),
("merchant_006", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_006", "merchant006@gmail.com", "0901000006", "MERCHANT", true, "verify_006", "merchant-006"),
("merchant_007", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_007", "merchant007@gmail.com", "0901000007", "MERCHANT", true, "verify_007", "merchant-007"),
("merchant_008", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_008", "merchant008@gmail.com", "0901000008", "MERCHANT", true, "verify_008", "merchant-008"),
("merchant_009", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_009", "merchant009@gmail.com", "0901000009", "MERCHANT", true, "verify_009", "merchant-009"),
("merchant_010", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_010", "merchant010@gmail.com", "0901000010", "MERCHANT", true, "verify_010", "merchant-010"),
("merchant_011", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_011", "merchant011@gmail.com", "0901000011", "MERCHANT", true, "verify_011", "merchant-011"),
("merchant_012", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_012", "merchant012@gmail.com", "0901000012", "MERCHANT", true, "verify_012", "merchant-012"),
("merchant_016", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_016", "merchant016@gmail.com", "0901000016", "MERCHANT", true, "verify_016", "merchant-016"),
("merchant_017", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_017", "merchant017@gmail.com", "0901000017", "MERCHANT", true, "verify_017", "merchant-017"),
("merchant_018", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_018", "merchant018@gmail.com", "0901000018", "MERCHANT", true, "verify_018", "merchant-018"),
("merchant_019", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_019", "merchant019@gmail.com", "0901000019", "MERCHANT", true, "verify_019", "merchant-019"),
("merchant_020", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_020", "merchant020@gmail.com", "0901000020", "MERCHANT", true, "verify_020", "merchant-020"),
("merchant_021", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_021", "merchant021@gmail.com", "0901000021", "MERCHANT", true, "verify_021", "merchant-021"),
("merchant_022", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_022", "merchant022@gmail.com", "0901000022", "MERCHANT", true, "verify_022", "merchant-022"),
("merchant_023", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_023", "merchant023@gmail.com", "0901000023", "MERCHANT", true, "verify_023", "merchant-023"),
("merchant_024", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_024", "merchant024@gmail.com", "0901000024", "MERCHANT", true, "verify_024", "merchant-024"),
("merchant_025", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_025", "merchant025@gmail.com", "0901000025", "MERCHANT", true, "verify_025", "merchant-025"),
("merchant_026", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_026", "merchant026@gmail.com", "0901000026", "MERCHANT", true, "verify_026", "merchant-026"),
("merchant_027", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_027", "merchant027@gmail.com", "0901000027", "MERCHANT", true, "verify_027", "merchant-027"),
("merchant_028", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_028", "merchant028@gmail.com", "0901000028", "MERCHANT", true, "verify_028", "merchant-028"),
("merchant_029", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_029", "merchant029@gmail.com", "0901000029", "MERCHANT", true, "verify_029", "merchant-029"),
("merchant_030", "$2a$12$qm2otp3bRqCk3Bc/R6qfjOcnIgBkL/J0KinMQl0vbnRenGEu4Rkza", "merchant_030", "merchant030@gmail.com", "0901000030", "MERCHANT", true, "verify_030", "merchant-030");


create table address (
    id varchar(255) primary key,
    `location` varchar(255) not null,
    longitude double not null,
    latitude double not null,
    user_id varchar(100) not null references users(id)
);

create index idx_userid on address(user_id);

drop database if exists `restaurant-service`;
create database if not exists `restaurant-service`;
use `restaurant-service`;

create table categories (
    id varchar(10) primary key,
    `cate_name` varchar(100) not null unique
);

create table restaurants (
    id varchar(255) primary key,
    `res_name` varchar(255) not null,
    `address` varchar(255) not null,
    longitude double not null,
    latitude double not null,
    rating float,
    opening_time time not null,
    closing_time time not null,
    image_url varchar(255),
    public_id varchar(255),
    phone varchar(15),
    total_review int default 0,
    merchant_id varchar(100) not null,
    slug varchar(255) not null unique,
    `enabled` boolean not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create index idx_restaurants_rating on restaurants(rating);

create index idx_merchantid on restaurants(merchant_id);

create table restaurant_categories (
    restaurant_id varchar(255) not null,
    category_id varchar(10) not null,
    PRIMARY KEY (restaurant_id, category_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

create table size (
    id varchar(5) primary key,
    `name` varchar(50) not null unique
);

create table products (
    id varchar(255) primary key,
    product_name varchar(255) not null,
    `description` text not null,
    restaurant_id varchar(255) not null references restaurants(id),
    image_url varchar(255),
    public_id varchar(255),
    category_id varchar(10) not null references categories(id),
    total_review int,
    rating float,
    slug varchar(255) not null unique,
    available boolean not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create index idx_restaurantid on products(restaurant_id);

create index idx_categoryid on products(category_id);

create index idx_products_rating on products(rating);

create table product_sizes (
    id varchar(255) primary key,
    product_id varchar(255) not null,
    size_id varchar(10) not null,
    price decimal not null,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (size_id) REFERENCES size(id)
);

create table reviews (
    id varchar(200) primary key,
    title varchar(255) not null,
    content text not null,
    rating float,
    review_id varchar(255) not null,
    review_type varchar(20) not null,
    created_at timestamp default current_timestamp,
    total_review int,
    user_id varchar(100) not null
);

create index idx_userid on reviews(user_id);

create index idx_reviewid on reviews(review_id);

drop database if exists `chat-service`;
create database if not exists `chat-service`;
use `chat-service`;

create table chat_rooms (
    id varchar(255) primary key,
    user1_id varchar(100) not null,
    user2_id varchar(100) not null,
    last_message_time timestamp default current_timestamp,
    last_message text
);

create index idx_chat_rooms_user1 on chat_rooms(user1_id);
create index idx_chat_rooms_user2 on chat_rooms(user2_id);

create table messages (
    id varchar(255) primary key,
    sender_id varchar(100) not null,
    receiver_id varchar(100) not null,
    content text not null,
    room_id varchar(255) not null references chat_rooms(id),
    `timestamp` timestamp default current_timestamp,
    `is_read` boolean default false
);

create index idx_roomid on messages(room_id);
create index idx_senderid on messages(sender_id);
create index idx_receiverid on messages(receiver_id);

-- Hiệu quả khi truy vấn tin nhắn trong một phòng theo thời gian gần nhất
CREATE INDEX idx_messages_room_timestamp ON messages(room_id, `timestamp` DESC);

drop database if exists `payment-service`;
CREATE DATABASE IF NOT EXISTS `payment-service`;
use `payment-service`;

CREATE TABLE payments (
  id CHAR(36) NOT NULL PRIMARY KEY, -- UUID dạng string
  paymentId VARCHAR(100) NOT NULL UNIQUE,
  orderId VARCHAR(100) NOT NULL,
  userId VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  currency CHAR(3) DEFAULT 'USD',
    paymentMethod ENUM('card') NOT NULL,
  paymentGateway VARCHAR(50) DEFAULT 'stripe',
  transactionId VARCHAR(200),
  status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  failureReason TEXT,
  refundAmount DECIMAL(10, 2) DEFAULT 0,
  refundReason TEXT,
  refundTransactionId VARCHAR(200),
  metadata JSON,
  processedAt DATETIME,
  refundedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes
  INDEX idx_orderId (orderId),
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);

CREATE TABLE IF NOT EXISTS wallets (
    id CHAR(36) PRIMARY KEY,
    restaurant_id VARCHAR(100) NOT NULL UNIQUE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    total_earned DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    total_withdrawn DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id CHAR(36) PRIMARY KEY,
    wallet_id CHAR(36) NOT NULL,
    order_id VARCHAR(100),
    payout_request_id CHAR(36),
    type ENUM('EARN', 'WITHDRAW') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_wallet_id (wallet_id),
    INDEX idx_order_id (order_id)
);

-- Seed Wallets
INSERT INTO wallets (id, restaurant_id, balance, total_earned, total_withdrawn) VALUES
(UUID(), 'RES001', 5000.00, 5000.00, 0),
(UUID(), 'RES002', 2000.00, 2000.00, 0),
(UUID(), 'RES003', 1000.00, 1000.00, 0),
(UUID(), 'RES004', 3000.00, 3000.00, 0),
(UUID(), 'RES005', 4000.00, 4000.00, 0),
(UUID(), 'RES006', 1500.00, 1500.00, 0),
(UUID(), 'RES007', 2500.00, 2500.00, 0),
(UUID(), 'RES008', 3500.00, 3500.00, 0),
(UUID(), 'RES009', 4500.00, 4500.00, 0),
(UUID(), 'RES010', 5500.00, 5500.00, 0),
(UUID(), 'RES011', 6000.00, 6000.00, 0),
(UUID(), 'RES012', 7000.00, 7000.00, 0),
(UUID(), 'RES013', 4500.00, 4500.00, 0), -- Ocean Breeze Seafood
(UUID(), 'RES014', 3500.00, 3500.00, 0), -- Hanoi Coffee Culture
(UUID(), 'RES015', 5000.00, 5000.00, 0), -- Sweet Treats Ice Cream
(UUID(), 'ADMIN_WALLET', 1000000.00, 1000000.00, 0);

