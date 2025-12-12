package com.CNTTK18.restaurant_service.dto.restaurant.response;

import com.CNTTK18.restaurant_service.dto.cate.response.cateResponse;
import com.CNTTK18.restaurant_service.dto.product.response.productResponseWithoutRes;
import java.time.LocalTime;
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
public class resResponseWithProduct {
    private String id;
    private String resName;
    private String address;
    private double longitude; // kinh độ
    private double latitude; // vĩ độ
    private float rating;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private String phone;
    private String imageURL;
    private String merchantId;
    private boolean enabled;
    private int totalReview;
    private double distance;
    private double duration;
    private List<productResponseWithoutRes> products;
    private List<cateResponse> cate;
}
