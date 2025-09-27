package com.CNTTK18.restaurant_service.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CNTTK18.restaurant_service.dto.response.MessageResponse;
import com.CNTTK18.restaurant_service.dto.review.request.reviewRequest;
import com.CNTTK18.restaurant_service.model.reviews;
import com.CNTTK18.restaurant_service.service.reviewService;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/review")
public class reviewController {
    private reviewService reviewService;
    public reviewController(reviewService reviewService) {
        this.reviewService = reviewService;
    }

    @Tag(name = "Get")
    @Operation(summary = "Get all reviews")
    @GetMapping("")
    public ResponseEntity<List<reviews>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @Tag(name = "Get")
    @Operation(summary = "Get review by ID")
    @GetMapping("/{id}")
    public ResponseEntity<reviews> getReviewById(@PathVariable String id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @Tag(name = "Post")
    @Operation(summary = "Create new review")
    @PostMapping("")
    @CircuitBreaker(name = "create", fallbackMethod = "fallbackMethod")
    @TimeLimiter(name = "create")
    @Retry(name = "create")
    public CompletableFuture<ResponseEntity<reviews>> createReview(@RequestBody @Valid reviewRequest reviewRequest) {
        return CompletableFuture.supplyAsync(() -> 
                    new ResponseEntity<>(reviewService.createReview(reviewRequest), HttpStatusCode.valueOf(201)));
    }

    public CompletableFuture<String> fallbackMethod(reviewRequest reviewRequest, Throwable ex)
    {
        System.out.println("Lỗi khi gọi createReview, kích hoạt fallback. Lỗi: " + ex.getMessage());
        return CompletableFuture.supplyAsync(() -> "Oops! Something went wrong, please wait for 5 more minutes~");
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete a review")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }
}
