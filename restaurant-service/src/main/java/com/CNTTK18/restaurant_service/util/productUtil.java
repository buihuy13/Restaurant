package com.CNTTK18.restaurant_service.util;

import com.CNTTK18.restaurant_service.dto.product.response.productResponse;
import com.CNTTK18.restaurant_service.dto.product.response.productResponseWithoutRes;
import com.CNTTK18.restaurant_service.dto.productSize.response.ProductSizeResponse;
import com.CNTTK18.restaurant_service.dto.restaurant.response.resResponse;
import com.CNTTK18.restaurant_service.model.products;

public class productUtil {
    public static productResponse mapProductToProductResponse(products product, resResponse resResponse) {
        return productResponse.builder()
                            .available(product.isAvailable())
                            .id(product.getId())
                            .categoryId(product.getCategory().getId())
                            .categoryName(product.getCategory().getCateName())
                            .description(product.getDescription())
                            .imageURL(product.getImageURL())
                            .productName(product.getProductName())
                            .productSizes(product.getProductSizes().stream()
                                            .map(ps -> new ProductSizeResponse(ps.getId(),ps.getSize().getName(),
                                                                                ps.getPrice(),ps.getSize().getId())).toList())
                            .restaurant(resResponse)
                            .rating(product.getRating())
                            .volume(product.getVolume())
                            .build();
    }

    public static productResponse mapProductToProductResponseWitoutResParam(products product) {
        return productResponse.builder()
                            .available(product.isAvailable())
                            .id(product.getId())
                            .categoryId(product.getCategory().getId())
                            .categoryName(product.getCategory().getCateName())
                            .description(product.getDescription())
                            .imageURL(product.getImageURL())
                            .productName(product.getProductName())
                            .productSizes(product.getProductSizes().stream()
                                            .map(ps -> new ProductSizeResponse(ps.getId(),ps.getSize().getName(),
                                                                                ps.getPrice(),ps.getSize().getId())).toList())
                            .rating(product.getRating())
                            .volume(product.getVolume())
                            .restaurant(resUtil.mapResToResResponse(product.getRestaurant()))
                            .build();
    }

    public static productResponseWithoutRes mapProductToProductResponseWithoutResParam(products product) {
        return productResponseWithoutRes.builder()
                            .available(product.isAvailable())
                            .id(product.getId())
                            .categoryId(product.getCategory().getId())
                            .categoryName(product.getCategory().getCateName())
                            .description(product.getDescription())
                            .imageURL(product.getImageURL())
                            .productName(product.getProductName())
                            .productSizes(product.getProductSizes().stream()
                                            .map(ps -> new ProductSizeResponse(ps.getId(),ps.getSize().getName(),
                                                                                ps.getPrice(),ps.getSize().getId())).toList())
                            .rating(product.getRating())
                            .volume(product.getVolume())
                            .build();
    }
}
