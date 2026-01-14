package com.CNTTK18.restaurant_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.Restaurants;

import jakarta.persistence.LockModeType;

@Repository
public interface ResRepository extends JpaRepository<Restaurants, String>, JpaSpecificationExecutor<Restaurants> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Restaurants> findRestaurantById(String id);

    Optional<List<Restaurants>>  findRestaurantsByMerchantId(String id);

    Optional<Restaurants> findBySlug(String slug);

    @Query(value = """
        SELECT DISTINCT r.*
        FROM restaurants r
        JOIN restaurant_categories rc ON r.id = rc.restaurant_id
        JOIN categories c ON c.id = rc.category_id
        WHERE r.enabled = true
        AND (:search IS NULL OR LOWER(r.res_name) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:#{#categories.size()} = 0 OR LOWER(c.cate_name) IN :categories)
        AND (6371000 * acos(
                LEAST(1.0, GREATEST(-1.0,
                    cos(radians(:latitude)) * 
                    cos(radians(r.latitude)) * 
                    cos(radians(r.longitude) - radians(:longitude)) + 
                    sin(radians(:latitude)) * 
                    sin(radians(r.latitude))
                ))
            )) <= :maxDistance
        """, 
        countQuery = """
        SELECT COUNT(DISTINCT r.id)
        FROM restaurants r
        JOIN restaurant_categories rc ON r.id = rc.restaurant_id
        JOIN categories c ON c.id = rc.category_id
        WHERE r.enabled = true
        AND (:search IS NULL OR LOWER(r.res_name) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:#{#categories.size()} = 0 OR LOWER(c.cate_name) IN :categories)
        AND (6371000 * acos(
                LEAST(1.0, GREATEST(-1.0,
                    cos(radians(:latitude)) * 
                    cos(radians(r.latitude)) * 
                    cos(radians(r.longitude) - radians(:longitude)) + 
                    sin(radians(:latitude)) * 
                    sin(radians(r.latitude))
                ))
            )) <= :maxDistance
        """,
        nativeQuery = true)
    Page<Restaurants> findRestaurantsWithinDistance(
        @Param("longitude") Double longitude,
        @Param("latitude") Double latitude,
        @Param("maxDistance") Integer maxDistance,
        @Param("search") String search,
        @Param("categories") List<String> categories,
        Pageable pageable
    );
}
