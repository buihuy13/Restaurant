package com.CNTTK18.restaurant_service.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.Products;
import com.CNTTK18.restaurant_service.model.Restaurants;

@Repository
public interface ProductRepository extends JpaRepository<Products, String>, JpaSpecificationExecutor<Products> {

    @Query("SELECT COUNT(p) FROM Products p JOIN p.category c JOIN p.restaurant r WHERE c.id = :cateId AND r.id = :resId")
    Long countProductWithCateIdWithInRes(@Param("cateId") String cateId, @Param("resId") String resId);

    Optional<Products> findProductById(String id);

    Optional<List<Products>> findProductsByRestaurant(Restaurants res);

    Optional<Products> findBySlug(String slug);

    @Query(value = """
        SELECT *
        FROM (
            SELECT DISTINCT p.*,
                (6371000 * acos(
                    LEAST(1.0, GREATEST(-1.0,
                        cos(radians(:latitude)) *
                        cos(radians(r.latitude)) *
                        cos(radians(r.longitude) - radians(:longitude)) +
                        sin(radians(:latitude)) *
                        sin(radians(r.latitude))
                    ))
                )) AS haversine_distance
            FROM products p
            JOIN restaurants r ON p.restaurant_id = r.id
            JOIN categories c ON c.id = p.category_id
            JOIN product_sizes ps ON ps.product_id = p.id
            WHERE r.enabled = true
            AND (:search IS NULL OR LOWER(p.product_name) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:#{#categories.size()} = 0 OR LOWER(c.cate_name) IN :categories)
            AND (:minPrice IS NULL OR ps.price >= :minPrice)
            AND (:maxPrice IS NULL OR ps.price <= :maxPrice)
        ) t
        WHERE t.haversine_distance <= :maxDistance
        ORDER BY
            CASE WHEN :sort = 'location_id_asc' THEN t.haversine_distance END ASC,
            CASE WHEN :sort = 'location_id_desc' THEN t.haversine_distance END DESC,
            CASE WHEN :sort = 'rating_id_asc' THEN t.rating END ASC,
            CASE WHEN :sort = 'rating_id_desc' THEN t.rating END DESC,
            t.id ASC
        """, 
        countQuery = """
        SELECT COUNT(DISTINCT p.id)
        FROM products p
        JOIN restaurants r ON p.restaurant_id = r.id
        JOIN categories c ON c.id = p.category_id
        JOIN product_sizes ps ON ps.product_id = p.id
        WHERE r.enabled = true
        AND (:search IS NULL OR LOWER(p.product_name) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:#{#categories.size()} = 0 OR LOWER(c.cate_name) IN :categories)
        AND (:minPrice IS NULL OR ps.price >= :minPrice)
        AND (:maxPrice IS NULL OR ps.price <= :maxPrice)
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
    Page<Products> findProductsWithinDistance(
        @Param("longitude") Double longitude,
        @Param("latitude") Double latitude,
        @Param("maxDistance") Integer maxDistance,
        @Param("search") String search,
        @Param("categories") List<String> categories,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("minPrice") BigDecimal minPrice,
        @Param("sort") String sort,
        Pageable pageable
    );
}
