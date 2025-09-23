package com.CNTTK18.restaurant_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.products;

@Repository
public interface productRepository extends JpaRepository<products, String> {

}
