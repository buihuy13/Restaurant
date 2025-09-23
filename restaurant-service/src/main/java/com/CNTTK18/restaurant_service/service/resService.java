package com.CNTTK18.restaurant_service.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import com.CNTTK18.Common.Exception.ResourceNotFoundException;
import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.restaurant_service.data.reviewType;
import com.CNTTK18.restaurant_service.dto.api.UserResponse;
import com.CNTTK18.restaurant_service.dto.restaurant.request.resRequest;
import com.CNTTK18.restaurant_service.dto.restaurant.request.updateRes;
import com.CNTTK18.restaurant_service.exception.InvalidRequestException;
import com.CNTTK18.restaurant_service.model.restaurants;
import com.CNTTK18.restaurant_service.model.reviews;
import com.CNTTK18.restaurant_service.repository.resRepository;
import com.CNTTK18.restaurant_service.repository.reviewRepository;

@Service
public class resService {
    private resRepository resRepository;
    private WebClient.Builder webClientBuilder;
    private ImageHandleService imageService;
    private reviewRepository reviewRepository;

    public resService(resRepository resRepository, WebClient.Builder webClientBuilder, 
                ImageHandleService imageHandleService, reviewRepository reviewRepository) {
        this.resRepository = resRepository;
        this.webClientBuilder = webClientBuilder;
        this.imageService = imageHandleService;
        this.reviewRepository = reviewRepository;
    }

    public List<restaurants> getAllRestaurants() {
        return resRepository.findAll();
    }

    public restaurants getRestaurantById(String id) {
        restaurants res = resRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        return res;
    }

    public restaurants createRestaurant(resRequest resRequest, MultipartFile imageFile) {
        UserResponse user = webClientBuilder.build()
                                .get()
                                .uri("lb://user-service/api/users/{id}", resRequest.getMerchantId())
                                .retrieve()
                                .bodyToMono(UserResponse.class)
                                .block();
        
        if (user == null) {
            throw new ResourceNotFoundException("Không tồn tại user");
        }
        if (user.getRole() != "MERCHANT") {
            throw new InvalidRequestException("User không phải là merchant");
        }

        restaurants res = restaurants.builder()
                            .address(resRequest.getAddress())
                            .categories(new HashSet<>())
                            .closingTime(resRequest.getClosingTime())
                            .enabled(false)
                            .id(RandomIdGenerator.generate(254))
                            .merchantId(resRequest.getMerchantId())
                            .openingTime(resRequest.getOpeningTime())
                            .phone(resRequest.getPhone())
                            .resName(resRequest.getResName())
                            .products(new HashSet<>())
                            .totalReview(0)
                            .rating(0)
                            .build();

        if (imageFile != null) {
            Map<String, String> image = imageService.saveImageFile(imageFile);
            res.setImageURL(image.get("url"));
            res.setPublicID(image.get("public_id"));
        }

        return resRepository.save(res);
    }

    public restaurants updateRestaurant(String id, updateRes updateRes, MultipartFile imageFile) {
        restaurants res = resRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        res.setAddress(updateRes.getAddress());
        res.setOpeningTime(updateRes.getOpeningTime());
        res.setClosingTime(updateRes.getClosingTime());
        res.setResName(updateRes.getResName());
        res.setPhone(updateRes.getPhone());
        imageService.deleteImage(res.getPublicID());
        if (imageFile != null) {
            Map<String, String> image = imageService.saveImageFile(imageFile);
            res.setImageURL(image.get("url"));
            res.setPublicID(image.get("public_id"));
        }
        else {
            res.setImageURL(null);
            res.setPublicID(null);
        }
        return resRepository.save(res);
    }

    public void deleteRestaurant(String id) {
        restaurants res = resRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        List<reviews> rv = reviewRepository.findByReviewId(id).stream()
                                .filter(r -> r.getReviewType().equals(reviewType.RESTAURANT.toString())).toList();
                            
        imageService.deleteImage(res.getPublicID());
        reviewRepository.deleteAll(rv);
        resRepository.delete(res);
    }
}
