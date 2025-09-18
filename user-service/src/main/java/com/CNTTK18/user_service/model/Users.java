package com.CNTTK18.user_service.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {
    @Id
    private String id;
    @NotBlank(message = "Username is mandatory")
    private String username;
    @Email
    @NotBlank(message = "Email is mandatory")
    private String email;
    @NotBlank(message = "Password is mandatory")
    private String password;
    private boolean enabled;
    @Column(name = "verificationcode")
    private String verficationCode;
    private String role;
}
