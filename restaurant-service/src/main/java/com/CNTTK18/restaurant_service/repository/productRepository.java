package com.CNTTK18.restaurant_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.products;
import com.CNTTK18.restaurant_service.model.restaurants;

import jakarta.persistence.LockModeType;

@Repository
public interface productRepository extends JpaRepository<products, String> {

    @Query("SELECT COUNT(p) FROM products p JOIN p.category c JOIN p.restaurant r WHERE c.id = :cateId AND r.id = :resId")
    Long countProductWithCateIdWithInRes(@Param("cateId") String cateId, @Param("resId") String resId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<products> findProductById(String id);

    Optional<List<products>> findProductsByRestaurant(restaurants res);

    Optional<products> findBySlug(String slug);
}
