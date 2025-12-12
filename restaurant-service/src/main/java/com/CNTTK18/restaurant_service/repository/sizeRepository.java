package com.CNTTK18.restaurant_service.repository;

import com.CNTTK18.restaurant_service.model.size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface sizeRepository extends JpaRepository<size, String> {}
