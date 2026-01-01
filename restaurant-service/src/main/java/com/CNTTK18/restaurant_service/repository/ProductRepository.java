package com.CNTTK18.restaurant_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.Products;
import com.CNTTK18.restaurant_service.model.Restaurants;

import jakarta.persistence.LockModeType;

@Repository
public interface ProductRepository extends JpaRepository<Products, String> {

    @Query("SELECT COUNT(p) FROM Products p JOIN p.category c JOIN p.restaurant r WHERE c.id = :cateId AND r.id = :resId")
    Long countProductWithCateIdWithInRes(@Param("cateId") String cateId, @Param("resId") String resId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Products> findProductById(String id);

    Optional<List<Products>> findProductsByRestaurant(Restaurants res);

    Optional<Products> findBySlug(String slug);
}
