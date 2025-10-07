package com.CNTTK18.restaurant_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.restaurants;

import jakarta.persistence.LockModeType;

@Repository
public interface resRepository extends JpaRepository<restaurants, String> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<restaurants> findRestaurantById(String id);

    Optional<List<restaurants>>  findRestaurantsByMerchantId(String id);
}
