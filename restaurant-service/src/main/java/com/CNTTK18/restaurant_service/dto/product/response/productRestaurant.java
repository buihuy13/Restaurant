package com.CNTTK18.restaurant_service.dto.product.response;

import java.time.LocalTime;
import java.util.Set;

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
public class productRestaurant {
    private String id;
    private String resName;
    private String address;
    private double longitude; //kinh độ
    private double latitude; //vĩ độ
    private float rating;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private String phone;
    private String imageURL;
    private String merchantId;
    private boolean enabled;
    private double distance;
    private double duration;
    private int totalReview;
    private Set<categories> categories;
}
