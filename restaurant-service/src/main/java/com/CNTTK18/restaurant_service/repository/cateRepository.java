package com.CNTTK18.restaurant_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.categories;

@Repository
public interface cateRepository extends JpaRepository<categories, String> {
    Optional<categories> findByCateName(String name);
}
