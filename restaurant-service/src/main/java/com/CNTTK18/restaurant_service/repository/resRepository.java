package com.CNTTK18.restaurant_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.restaurants;

@Repository
public interface resRepository extends JpaRepository<restaurants, String> {

}
