drop database if exists `user-service`;
create database if not exists `user-service`;
use `user-service`;

create table users (
    id varchar(255) primary key,
    username varchar(255) not null,
    email varchar(255) not null unique,
    `password` varchar(255) not null,
    `role` varchar(10) not null,
    `enabled` boolean not null,
    verificationcode varchar(255) not null,
    phone varchar(15) not null
);

create table address (
    id varchar(255) primary key,
    location varchar(255) not null,
    user_id varchar(255) not null references users(id)
);

drop database if exists `restaurant-service`;
create database if not exists `restaurant-service`;
use `restaurant-service`;

create table categories (
    id varchar(10) primary key,
    name varchar(100) not null unique
);

create table restaurants (
    id varchar(255) primary key,
    `name` varchar(255) not null,
    `address` varchar(255) not null,
    rating float not null,
    openingtime time not null,
    closingtime time not null,
    `imagename` varchar(255) not null,
    `imagetype` varchar(50) not null,
    `imagedata` longblob not null,
    merchant_id varchar(255) not null 
);

create table restaurant_categories (
    id varchar(255) primary key,
    restaurant_id varchar(255) not null references restaurants(id),
    category_id varchar(10) not null references categories(id),
    UNIQUE KEY unique_restaurant_category (restaurant_id, category_id)
);

create table size (
    id varchar(10) primary key,
    name varchar(50) not null unique
);

create table products (
    id varchar(255) primary key,
    name varchar(255) not null,
    `description` text not null,
    price decimal not null,
    restaurant_id varchar(255) not null references restaurants(id),
    imagename varchar(255) not null,
    imagetype varchar(50) not null,
    imagedata longblob not null,
    category_id varchar(10) not null references categories(id),
    volume int not null,
    available boolean not null
);

create table product_sizes (
    id varchar(255) primary key,
    product_id varchar(255) not null references products(id),
    size_id varchar(10) not null references size(id),
    UNIQUE KEY unique_product_size (product_id, size_id)
);

create table reviews (
    id varchar(200) primary key,
    title varchar(255) not null,
    content text not null,
    rating float not null,
    review_id varchar(255) not null,
    review_type varchar(20) not null,
    created_at timestamp default current_timestamp,
    user_id varchar(255) not null
);