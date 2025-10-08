drop database if exists `user-service`;
create database if not exists `user-service`;
use `user-service`;

create table users (
    id varchar(255) primary key,
    username varchar(255) not null,
    email varchar(255) not null unique,
    `password` varchar(255),
    `role` varchar(10) not null,
    `enabled` boolean not null,
    verificationcode varchar(255),
    phone varchar(15),
    authprovider varchar(20) default 'LOCAL'
);

create index idx_email on users(email);

insert into users(id, `password`, username, email, phone, `role`, `enabled`, `verificationcode`) values 
("testadminid", "$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m", "testadmin", "testadmin@gmail.com", "0762612698", "ADMIN", true, "abcxyz123"),
("testuserid", "$2a$12$CydeMvJj1Hvu/824Lh2NuOEIrZnlhRMIUM736cYXa7bSD3LUmGW7K", "testuser", "testuser@gmail.com", "0762612699", "USER", true, "abcxyz456"),
("testmerchantid", "$2a$12$xv4.GmxuJeUUs54wJNwPdODdcvnHs7ikvpCuLeVVMy4tki5hZLq/m", "testmerchant", "testmerchant@gmail.com", "0762612697", "MERCHANT", true, "abcxyz789");
create table address (
    id varchar(255) primary key,
    `location` varchar(255) not null,
    longitude double not null,
    latitude double not null,
    user_id varchar(255) not null references users(id)
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
    merchant_id varchar(255) not null,
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
    available boolean not null
);

create index idx_restaurantid on products(restaurant_id);

create index idx_categoryid on products(category_id);

create table product_sizes (
    product_id varchar(255) not null,
    size_id varchar(10) not null,
    price decimal not null,
    PRIMARY KEY (product_id, size_id),
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
    user_id varchar(255) not null
);

create index idx_userid on reviews(user_id);

create index idx_reviewid on reviews(review_id);