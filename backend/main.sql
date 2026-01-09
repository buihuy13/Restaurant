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
("testadminid", "$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m", "testadmin", "testadmin@gmail.com", "0762612698", "ADMIN", true, "abcxyz123", "abcxyz"),
("testuserid", "$2a$12$CydeMvJj1Hvu/824Lh2NuOEIrZnlhRMIUM736cYXa7bSD3LUmGW7K", "testuser", "testuser@gmail.com", "0762612699", "USER", true, "abcxyz456", "abc"),
("testmerchantid", "$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m", "testmerchant", "testmerchant@gmail.com", "0762612697", "MERCHANT", true, "abcxyz789", "xyz"),
('user_gen_01', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_01', 'user01@gmail.com', '0901000001', 'USER', true, 'token_01', 'local1'),
('user_gen_02', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_02', 'user02@gmail.com', '0901000002', 'USER', true, 'token_02', 'local2'),
('user_gen_03', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_03', 'user03@gmail.com', '0901000003', 'USER', true, 'token_03', 'local3'),
('user_gen_04', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_04', 'user04@gmail.com', '0901000004', 'USER', true, 'token_04', 'local4'),
('user_gen_05', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_05', 'user05@gmail.com', '0901000005', 'USER', true, 'token_05', 'local5'),
('user_gen_06', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_06', 'user06@gmail.com', '0901000006', 'USER', true, 'token_06', 'local6'),
('user_gen_07', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_07', 'user07@gmail.com', '0901000007', 'USER', true, 'token_07', 'local7'),
('user_gen_08', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_08', 'user08@gmail.com', '0901000008', 'USER', true, 'token_08', 'local8'),
('user_gen_09', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_09', 'user09@gmail.com', '0901000009', 'USER', true, 'token_09', 'local9'),
('user_gen_10', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_10', 'user10@gmail.com', '0901000010', 'USER', true, 'token_10', 'local10'),
('user_gen_11', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_11', 'user11@gmail.com', '0901000011', 'USER', true, 'token_11', 'local11'),
('user_gen_12', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_12', 'user12@gmail.com', '0901000012', 'USER', true, 'token_12', 'local12'),
('user_gen_13', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_13', 'user13@gmail.com', '0901000013', 'USER', true, 'token_13', 'local13'),
('user_gen_14', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_14', 'user14@gmail.com', '0901000014', 'USER', true, 'token_14', 'local14'),
('user_gen_15', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_15', 'user15@gmail.com', '0901000015', 'USER', true, 'token_15', 'local15'),
('user_gen_16', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_16', 'user16@gmail.com', '0901000016', 'USER', true, 'token_16', 'local16'),
('user_gen_17', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_17', 'user17@gmail.com', '0901000017', 'USER', true, 'token_17', 'local17'),
('user_gen_18', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_18', 'user18@gmail.com', '0901000018', 'USER', true, 'token_18', 'local18'),
('user_gen_19', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_19', 'user19@gmail.com', '0901000019', 'USER', true, 'token_19', 'local19'),
('user_gen_20', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_20', 'user20@gmail.com', '0901000020', 'USER', true, 'token_20', 'local20'),
('user_gen_21', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_21', 'user21@gmail.com', '0901000021', 'USER', true, 'token_21', 'local21'),
('user_gen_22', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_22', 'user22@gmail.com', '0901000022', 'USER', true, 'token_22', 'local22'),
('user_gen_23', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_23', 'user23@gmail.com', '0901000023', 'USER', true, 'token_23', 'local23'),
('user_gen_24', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_24', 'user24@gmail.com', '0901000024', 'USER', true, 'token_24', 'local24'),
('user_gen_25', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_25', 'user25@gmail.com', '0901000025', 'USER', true, 'token_25', 'local25'),
('user_gen_26', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_26', 'user26@gmail.com', '0901000026', 'USER', true, 'token_26', 'local26'),
('user_gen_27', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_27', 'user27@gmail.com', '0901000027', 'USER', true, 'token_27', 'local27'),
('user_gen_28', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_28', 'user28@gmail.com', '0901000028', 'USER', true, 'token_28', 'local28'),
('user_gen_29', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_29', 'user29@gmail.com', '0901000029', 'USER', true, 'token_29', 'local29'),
('user_gen_30', '$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m', 'user_30', 'user30@gmail.com', '0901000030', 'USER', true, 'token_30', 'local30');

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
    volume int not null,
    total_review int,
    rating float,
    slug varchar(255) not null unique,
    available boolean not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create index idx_restaurantid on products(restaurant_id);

create index idx_categoryid on products(category_id);

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
  paymentMethod ENUM('cash', 'card', 'wallet') NOT NULL,
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

