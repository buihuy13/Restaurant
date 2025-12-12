package com.CNTTK18.restaurant_service.service;

import com.CNTTK18.Common.Exception.ResourceNotFoundException;
import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.restaurant_service.data.reviewType;
import com.CNTTK18.restaurant_service.dto.api.UserResponse;
import com.CNTTK18.restaurant_service.dto.review.request.reviewRequest;
import com.CNTTK18.restaurant_service.exception.InvalidRequestException;
import com.CNTTK18.restaurant_service.model.products;
import com.CNTTK18.restaurant_service.model.restaurants;
import com.CNTTK18.restaurant_service.model.reviews;
import com.CNTTK18.restaurant_service.repository.productRepository;
import com.CNTTK18.restaurant_service.repository.resRepository;
import com.CNTTK18.restaurant_service.repository.reviewRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class reviewService {
    private reviewRepository reviewRepo;
    private WebClient.Builder webClientBuilder;
    private productRepository productRepository;
    private resRepository resRepository;

    public reviewService(
            reviewRepository reviewRepo,
            WebClient.Builder webClientBuilder,
            productRepository productRepository,
            resRepository resRepository) {
        this.reviewRepo = reviewRepo;
        this.webClientBuilder = webClientBuilder;
        this.productRepository = productRepository;
        this.resRepository = resRepository;
    }

    public List<reviews> getAllReviews(String resId, String productId) {
        List<reviews> rv = reviewRepo.findAll();
        if (resId != null && !resId.isEmpty()) {
            rv = rv.stream().filter(r -> r.getReviewId().equals(resId)).toList();
        } else if (productId != null && !productId.isEmpty()) {
            rv = rv.stream().filter(r -> r.getReviewId().equals(productId)).toList();
        }
        return rv;
    }

    public reviews getReviewById(String id) {
        reviews rv =
                reviewRepo
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        return rv;
    }

    @Transactional
    public reviews createReview(reviewRequest reviewRequest) {
        UserResponse user =
                webClientBuilder
                        .build()
                        .get()
                        .uri("lb://user-service/api/users/{id}", reviewRequest.getUserId())
                        .retrieve()
                        .bodyToMono(UserResponse.class)
                        .block();

        if (user == null) {
            throw new ResourceNotFoundException("Không tồn tại user");
        }
        String rvType = reviewRequest.getReviewType();
        String rvId = reviewRequest.getReviewId();
        // handle check xem product or restaurant đó có tồn tại hay không
        if (rvType.equals(reviewType.PRODUCT.toString())) {
            products product =
                    productRepository
                            .findProductById(rvId)
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            float newRating =
                    (product.getTotalReview() * product.getRating() + reviewRequest.getRating())
                            / (product.getTotalReview() + 1);
            product.setTotalReview(product.getTotalReview() + 1);
            product.setRating(newRating);
            productRepository.save(product);
        } else if (rvType.equals(reviewType.RESTAURANT.toString())) {
            restaurants res =
                    resRepository
                            .findRestaurantById(rvId)
                            .orElseThrow(
                                    () -> new ResourceNotFoundException("Restaurant not found"));

            float newRating =
                    (res.getTotalReview() * res.getRating() + reviewRequest.getRating())
                            / (res.getTotalReview() + 1);
            res.setTotalReview(res.getTotalReview() + 1);
            res.setRating(newRating);
            resRepository.save(res);
        } else {
            throw new InvalidRequestException("Review Type phải là PRODUCT hoặc RESTAURANT");
        }
        reviews rv =
                new reviews(
                        RandomIdGenerator.generate(200),
                        reviewRequest.getUserId(),
                        rvId,
                        rvType,
                        reviewRequest.getTitle(),
                        reviewRequest.getContent(),
                        reviewRequest.getRating(),
                        null);

        return reviewRepo.save(rv);
    }

    @Transactional
    public void deleteReview(String id) {
        reviews rv =
                reviewRepo
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        String rvType = rv.getReviewType();
        if (rvType.equals(reviewType.PRODUCT.toString())) {
            products product =
                    productRepository
                            .findProductById(rv.getReviewId())
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            int totalReview = product.getTotalReview();
            if (totalReview == 1) {
                product.setTotalReview(0);
                product.setRating(0);
            } else {
                float newRating =
                        (product.getTotalReview() * product.getRating() - rv.getRating())
                                / (product.getTotalReview() - 1);
                product.setTotalReview(product.getTotalReview() - 1);
                product.setRating(newRating);
            }
            productRepository.save(product);
        } else if (rvType.equals(reviewType.RESTAURANT.toString())) {
            restaurants res =
                    resRepository
                            .findRestaurantById(rv.getReviewId())
                            .orElseThrow(
                                    () -> new ResourceNotFoundException("Restaurant not found"));

            int total_review = res.getTotalReview();
            if (total_review == 1) {
                res.setTotalReview(0);
                res.setRating(0);
            } else {
                float newRating =
                        (res.getTotalReview() * res.getRating() - rv.getRating())
                                / (res.getTotalReview() - 1);
                res.setTotalReview(res.getTotalReview() - 1);
                res.setRating(newRating);
            }
            resRepository.save(res);
        }
        reviewRepo.delete(rv);
    }
}
