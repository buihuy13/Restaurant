package com.CNTTK18.restaurant_service.util;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.CNTTK18.restaurant_service.dto.product.response.productResponse;
import com.CNTTK18.restaurant_service.dto.product.response.productRestaurant;
import com.CNTTK18.restaurant_service.dto.product.response.productWithoutResResponse;
import com.CNTTK18.restaurant_service.model.products;

public class productUtil {
    public static productResponse mapProductToProductResponse(products product) {
        return productResponse.builder()
                            .available(product.isAvailable())
                            .id(product.getId())
                            .category(product.getCategory())
                            .description(product.getDescription())
                            .imageURL(product.getImageURL())
                            .productName(product.getProductName())
                            .productSizes(product.getProductSizes())
                            .restaurant(resUtil.mapProductRestaurant(product.getRestaurant()))
                            .rating(product.getRating())
                            .volume(product.getVolume())
                            .build();
    }

    public static productResponse mapProductToProductResponseWithResParam(products product, productRestaurant resResponse) {
        return productResponse.builder()
                            .available(product.isAvailable())
                            .id(product.getId())
                            .category(product.getCategory())
                            .description(product.getDescription())
                            .imageURL(product.getImageURL())
                            .productName(product.getProductName())
                            .productSizes(product.getProductSizes())
                            .restaurant(resResponse)
                            .rating(product.getRating())
                            .volume(product.getVolume())
                            .build();
    }

    public static productWithoutResResponse maProductWithoutResResponse(products product) {
        return productWithoutResResponse.builder()
                            .available(product.isAvailable())
                            .id(product.getId())
                            .category(product.getCategory())
                            .description(product.getDescription())
                            .imageURL(product.getImageURL())
                            .productName(product.getProductName())
                            .productSizes(product.getProductSizes())
                            .rating(product.getRating())
                            .volume(product.getVolume())
                            .build();
    }

    public static List<productWithoutResResponse> maProductWithoutResResponseList(Set<products> products) {
        return products.stream().map(p -> maProductWithoutResResponse(p)).toList();
    }

    public static Set<productWithoutResResponse> maProductWithoutResResponseSet(Set<products> products) {
        return new HashSet<>(products.stream().map(p -> maProductWithoutResResponse(p)).toList());
    }
}
