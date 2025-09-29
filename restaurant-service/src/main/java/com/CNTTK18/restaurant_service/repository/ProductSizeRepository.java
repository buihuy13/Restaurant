package com.CNTTK18.restaurant_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.ProductSize;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize, String> {
    List<ProductSize> findByProductId(String productId);
    List<ProductSize> findBySizeId(String sizeId);
    Optional<ProductSize> findByProductIdAndSizeId(String productId, String sizeId);
    void deleteByProductIdAndSizeId(String productId, String sizeId);
}