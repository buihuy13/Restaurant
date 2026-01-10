package com.CNTTK18.user_service.dto.response;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String username;
    private String email;
    private boolean enabled;
    private String role;
    private String phone;
    private String slug;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
