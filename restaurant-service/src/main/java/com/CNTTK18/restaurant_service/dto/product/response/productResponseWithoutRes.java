package com.CNTTK18.restaurant_service.dto.product.response;

import com.CNTTK18.restaurant_service.dto.productSize.response.ProductSizeResponse;
import java.util.List;
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
public class productResponseWithoutRes {
    private String id;
    private String productName;
    private String description;
    private String imageURL;
    private String categoryName;
    private String categoryId;
    private int volume;
    private boolean available;
    private int totalReview;
    private float rating;
    private List<ProductSizeResponse> productSizes;
}
