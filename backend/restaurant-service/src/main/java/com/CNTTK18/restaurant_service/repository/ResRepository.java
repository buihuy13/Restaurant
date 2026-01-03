package com.CNTTK18.restaurant_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.Restaurants;

import jakarta.persistence.LockModeType;

@Repository
public interface ResRepository extends JpaRepository<Restaurants, String> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Restaurants> findRestaurantById(String id);

    Optional<List<Restaurants>>  findRestaurantsByMerchantId(String id);

    Optional<Restaurants> findBySlug(String slug);
}
