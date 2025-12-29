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
    verificationcode varchar(255),
    phone varchar(15),
    slug varchar(255) not null unique,
    authprovider varchar(20) default 'LOCAL',
    createdat DATETIME(6) default current_timestamp,
    activatedat DATETIME(6)
);

create index idx_email on users(email);

insert into users(id, `password`, username, email, phone, `role`, `enabled`, `verificationcode`, `slug`) values 
("testadminid", "$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m", "testadmin", "testadmin@gmail.com", "0762612698", "ADMIN", true, "abcxyz123", "abcxyz"),
("testuserid", "$2a$12$CydeMvJj1Hvu/824Lh2NuOEIrZnlhRMIUM736cYXa7bSD3LUmGW7K", "testuser", "testuser@gmail.com", "0762612699", "USER", true, "abcxyz456", "abc"),
("testmerchantid", "$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m", "testmerchant", "testmerchant@gmail.com", "0762612697", "MERCHANT", true, "abcxyz789", "xyz");
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
    `catename` varchar(100) not null unique
);

create table restaurants (
    id varchar(255) primary key,
    `resname` varchar(255) not null,
    `address` varchar(255) not null,
    longitude double not null,
    latitude double not null,
    rating float,
    openingtime time not null,
    closingtime time not null,
    imageurl varchar(255),
    publicid varchar(255),
    phone varchar(15),
    total_review int default 0,
    merchant_id varchar(100) not null,
    slug varchar(255) not null unique,
    `enabled` boolean not null
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
    imageurl varchar(255),
    publicid varchar(255),
    category_id varchar(10) not null references categories(id),
    volume int not null,
    total_review int,
    rating float,
    slug varchar(255) not null unique,
    available boolean not null
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
    `read` boolean default false
);

create index idx_roomid on messages(room_id);
create index idx_senderid on messages(sender_id);
create index idx_receiverid on messages(receiver_id);

-- Hiệu quả khi truy vấn tin nhắn trong một phòng theo thời gian gần nhất
CREATE INDEX idx_messages_room_timestamp ON messages(room_id, `timestamp` DESC);


CREATE DATABASE IF NOT EXISTS `payment-service`;

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

