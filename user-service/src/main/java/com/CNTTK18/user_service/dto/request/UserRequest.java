package com.CNTTK18.user_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    @NotBlank(message = "Username is mandatory")
    private String username;
    @Email
    @NotBlank(message = "Email is mandatory")
    private String email;
}
