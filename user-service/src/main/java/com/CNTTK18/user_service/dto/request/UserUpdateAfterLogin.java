package com.CNTTK18.user_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserUpdateAfterLogin {
    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Default address is required")
    private String defaultAddress;

    @NotNull private double longitude;
    @NotNull private double latitude;
}
