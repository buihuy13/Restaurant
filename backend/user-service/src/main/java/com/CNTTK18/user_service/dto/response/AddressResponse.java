package com.CNTTK18.user_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponse {
    private String id;
    private String location;
    private double longitude;
    private double latitude;
    private UserResponse user;
}
