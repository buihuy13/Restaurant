package com.CNTTK18.restaurant_service.model;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reviews")
public class Reviews {
    @Id
    private String id;
    @Column(name = "user_id", nullable = false)
    private String userId;
    private String reviewId; // Id của product hoặc restaurant
    private String reviewType; // "PRODUCT" hoặc "RESTAURANT"
    private String title;
    private String content;
    private float rating;
    private Timestamp createdAt;
}
