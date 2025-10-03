package com.CNTTK18.restaurant_service.util;

import com.CNTTK18.restaurant_service.dto.restaurant.response.resResponse;
import com.CNTTK18.restaurant_service.model.restaurants;

public class resUtil {
    public static resResponse mapResToResResponse(restaurants res) {
        return resResponse.builder()
                        .id(res.getId())
                        .address(res.getAddress())
                        .resName(res.getResName())
                        .longitude(res.getLongitude())
                        .latitude(res.getLatitude())
                        .rating(res.getRating())
                        .openingTime(res.getOpeningTime())
                        .closingTime(res.getClosingTime())
                        .phone(res.getPhone())
                        .imageURL(res.getImageURL())
                        .merchantId(res.getMerchantId())
                        .enabled(res.isEnabled())
                        .totalReview(res.getTotalReview())
                        .categories(res.getCategories())
                        .build();
    }

    public static resResponse mapResToResResponsewithDistanceAndDuration(restaurants res, Double distance, Double duration) {
        return resResponse.builder()
                        .id(res.getId())
                        .address(res.getAddress())
                        .resName(res.getResName())
                        .longitude(res.getLongitude())
                        .latitude(res.getLatitude())
                        .rating(res.getRating())
                        .openingTime(res.getOpeningTime())
                        .closingTime(res.getClosingTime())
                        .phone(res.getPhone())
                        .imageURL(res.getImageURL())
                        .merchantId(res.getMerchantId())
                        .enabled(res.isEnabled())
                        .totalReview(res.getTotalReview())
                        .categories(res.getCategories())
                        .distance(distance)
                        .duration(duration)
                        .build();
    }
}
