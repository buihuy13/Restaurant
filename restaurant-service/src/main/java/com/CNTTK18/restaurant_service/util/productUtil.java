package com.CNTTK18.restaurant_service.util;

import com.CNTTK18.restaurant_service.dto.product.response.productResponse;
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
                            .restaurant(product.getRestaurant())
                            .rating(product.getRating())
                            .volume(product.getVolume())
                            .build();
    }
}
