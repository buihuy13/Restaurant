package com.CNTTK18.restaurant_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.size;

@Repository
public interface sizeRepository extends JpaRepository<size, String> {

}
