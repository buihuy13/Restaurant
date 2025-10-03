package com.CNTTK18.restaurant_service.service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import com.CNTTK18.Common.Exception.ResourceNotFoundException;
import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.restaurant_service.data.reviewType;
import com.CNTTK18.restaurant_service.dto.api.UserResponse;
import com.CNTTK18.restaurant_service.dto.distance.response.Summary;
import com.CNTTK18.restaurant_service.dto.restaurant.request.Coordinates;
import com.CNTTK18.restaurant_service.dto.restaurant.request.resRequest;
import com.CNTTK18.restaurant_service.dto.restaurant.request.updateRes;
import com.CNTTK18.restaurant_service.dto.restaurant.response.resResponse;
import com.CNTTK18.restaurant_service.exception.DistanceDurationException;
import com.CNTTK18.restaurant_service.exception.InvalidRequestException;
import com.CNTTK18.restaurant_service.model.restaurants;
import com.CNTTK18.restaurant_service.model.reviews;
import com.CNTTK18.restaurant_service.repository.resRepository;
import com.CNTTK18.restaurant_service.repository.reviewRepository;
import com.CNTTK18.restaurant_service.util.resUtil;

import jakarta.transaction.Transactional;
import reactor.core.publisher.Mono;

@Service
public class resService {
    private resRepository resRepository;
    private WebClient.Builder webClientBuilder;
    private ImageHandleService imageService;
    private reviewRepository reviewRepository;
    private DistanceService distanceService;

    public resService(resRepository resRepository, WebClient.Builder webClientBuilder, 
                ImageHandleService imageHandleService, reviewRepository reviewRepository, DistanceService distanceService) {
        this.resRepository = resRepository;
        this.webClientBuilder = webClientBuilder;
        this.imageService = imageHandleService;
        this.reviewRepository = reviewRepository;
        this.distanceService = distanceService;
    }

    public Mono<List<resResponse>> getAllRestaurants(Coordinates location, String search, Integer nearby) {
        List<restaurants> res = resRepository.findAll();
        if (search != null && !search.isEmpty()) {
            res = res.stream().filter(r -> r.getResName().toLowerCase().contains(search.toLowerCase())).toList();
        }
        
        // Lấy các res trong bán kính nearby (theo đường chim bay)
        if (nearby != null) {
            res = res.stream().filter(
                r -> {
                    Double distance = distanceService.calculateHaversineDistance(location.getLongitude(), location.getLatitude(),
                                                                                r.getLongitude(), r.getLatitude());
                                                                        
                    return distance <= nearby;
                }
            ).toList();
        }

        if (res.isEmpty()) {
            return Mono.just(Collections.emptyList());
        }

        final List<restaurants> filteredRes = res;
        
        List<Double> startingPoints = List.of(location.getLongitude(), location.getLatitude());
        List<List<Double>> endPoints = res.stream().map(r -> List.of(r.getLongitude(), r.getLatitude())).toList();
        
        return distanceService.getDistanceAndDurationInList(startingPoints, endPoints)
                    .map(response -> {
                        List<Double> durations = response.getDurations().get(0);
                        List<Double> distances = response.getDistances().get(0);

                        return IntStream.range(0, filteredRes.size()).mapToObj(i -> {
                            restaurants resIndex = filteredRes.get(i);

                            resResponse resResponseIndex = resUtil.mapResToResResponse(resIndex);
                            resResponseIndex.setDuration(durations.get(i));
                            resResponseIndex.setDistance(distances.get(i));
                            return resResponseIndex;
                        }).toList();
                    });
    }

    public Mono<resResponse> getRestaurantById(String id, Coordinates location) {
        restaurants res = resRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        List<Double> start = List.of(location.getLongitude(), location.getLatitude());
        List<Double> end = List.of(res.getLongitude(), res.getLatitude());
        return distanceService.getDistanceAndDuration(start, end)
                        .map(response -> {
                            if (response == null || response.getFeatures().isEmpty()) {
                                throw new DistanceDurationException("Error while calculating distance and duration");
                            }
                            Summary summary = response.getFeatures().get(0).getProperties().getSummary();  
                            double distance = summary.getDistance();
                            double duration = summary.getDuration();
                                
                            return resUtil.mapResToResResponsewithDistanceAndDuration(res, distance, duration);
                        });
    }

    @Transactional
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
        if (!user.getRole().equals("MERCHANT")) {
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
                            .longitude(resRequest.getLongitude())
                            .latitude(resRequest.getLatitude())
                            .build();

        if (imageFile != null) {
            Map<String, String> image = imageService.saveImageFile(imageFile);
            res.setImageURL(image.get("url"));
            res.setPublicID(image.get("public_id"));
        }

        return resRepository.save(res);
    }

    @Transactional
    public restaurants updateRestaurant(String id, updateRes updateRes, MultipartFile imageFile) {
        restaurants res = resRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        res.setAddress(updateRes.getAddress());
        res.setOpeningTime(updateRes.getOpeningTime());
        res.setClosingTime(updateRes.getClosingTime());
        res.setResName(updateRes.getResName());
        res.setPhone(updateRes.getPhone());
        res.setLongitude(updateRes.getLongitude());
        res.setLatitude(updateRes.getLatitude());
        if (imageFile != null) {
            String oldPublicId = res.getPublicID();
            Map<String, String> image = imageService.saveImageFile(imageFile);
            res.setImageURL(image.get("url"));
            res.setPublicID(image.get("public_id"));
            if (oldPublicId != null && !oldPublicId.isEmpty()) {
                imageService.deleteImage(oldPublicId);
            }
        }
        return resRepository.save(res);
    }

    @Transactional
    public void deleteRestaurant(String id) {
        restaurants res = resRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        List<reviews> rv = reviewRepository.findByReviewId(id).stream()
                                .filter(r -> r.getReviewType().equals(reviewType.RESTAURANT.toString())).toList();
                            
        if (res.getPublicID() != null && !res.getPublicID().isEmpty()) {
            imageService.deleteImage(res.getPublicID());
        }
        reviewRepository.deleteAll(rv);
        resRepository.delete(res);
    }

    @Transactional
    public void changeResStatus(String id) {
        restaurants res = resRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        res.setEnabled(!res.isEnabled());
        resRepository.save(res);
    }

    public void deleteImage(String resId) {
        restaurants res = resRepository.findById(resId)
                            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        imageService.deleteImage(res.getPublicID());
        res.setImageURL(null);
        res.setPublicID(null);
    }
}
