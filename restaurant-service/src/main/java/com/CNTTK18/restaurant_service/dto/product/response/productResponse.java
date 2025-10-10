package com.CNTTK18.restaurant_service.dto.product.response;

import java.util.Set;

import com.CNTTK18.restaurant_service.dto.restaurant.response.resResponse;
import com.CNTTK18.restaurant_service.model.ProductSize;
import com.CNTTK18.restaurant_service.model.categories;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class productResponse {
    private String id;
    private String productName;
    private String description;
    private String imageURL;
    private categories category;
    private int volume;
    private boolean available;
    private resResponse restaurant;
    private int totalReview;
    private float rating;
    private Set<ProductSize> productSizes;
}
