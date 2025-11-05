package com.CNTTK18.restaurant_service.util;

import com.CNTTK18.restaurant_service.dto.cate.response.cateResponse;
import com.CNTTK18.restaurant_service.dto.restaurant.response.resResponse;
import com.CNTTK18.restaurant_service.dto.restaurant.response.resResponseWithProduct;
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
                        .cate(res.getCategories().stream().map(c -> new cateResponse(c.getId(),c.getCateName())).toList())
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
                        .distance(distance)
                        .duration(duration)
                        .cate(res.getCategories().stream().map(c -> new cateResponse(c.getId(),c.getCateName())).toList())
                        .build();
    }

    public static resResponseWithProduct mapResToResResponseWithProduct(restaurants res) {
        return resResponseWithProduct.builder()
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
                        .products(res.getProducts().stream().map(productUtil::mapProductToProductResponseWithoutResParam).toList())
                        .cate(res.getCategories().stream().map(c -> new cateResponse(c.getId(),c.getCateName())).toList())
                        .build();
    }

    public static resResponseWithProduct mapResToResResponseWithProductandDistanceAndDuration(restaurants res, Double distance, Double duration) {
        return resResponseWithProduct.builder()
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
                        .distance(distance)
                        .duration(duration)
                        .products(res.getProducts().stream().map(productUtil::mapProductToProductResponseWithoutResParam).toList())
                        .cate(res.getCategories().stream().map(c -> new cateResponse(c.getId(),c.getCateName())).toList())
                        .build();
    }
}
