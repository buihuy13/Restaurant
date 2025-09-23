package com.CNTTK18.restaurant_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CNTTK18.restaurant_service.model.reviews;

@Repository
public interface reviewRepository extends JpaRepository<reviews, String> {
    List<reviews> findByReviewId(String id);
}
