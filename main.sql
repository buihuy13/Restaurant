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
verificationcode varchar(255) not null 
phone varchar(15) not null);

create table address (
id varchar(255) primary key,
location varchar(255) not null,
user_id varchar(255) not null references users(id)
);