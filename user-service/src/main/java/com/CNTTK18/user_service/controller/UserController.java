package com.CNTTK18.user_service.controller;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CNTTK18.user_service.dto.request.Login;
import com.CNTTK18.user_service.dto.request.Register;
import com.CNTTK18.user_service.dto.request.Rejection;
import com.CNTTK18.user_service.dto.request.UserRequest;
import com.CNTTK18.user_service.dto.response.TokenResponse;
import com.CNTTK18.user_service.dto.response.UserResponse;
import com.CNTTK18.user_service.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    record MessageResponse(String message) {
    }

    @Tag(name = "Post")
    @Operation(summary = "Login")
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody @Valid Login login) {
        TokenResponse token = userService.login(login);
        return ResponseEntity.ok(token);
    }

    @Tag(name = "Post")
    @Operation(summary = "Register")
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@RequestBody @Valid Register user) {
        userService.register(user);
        return ResponseEntity.ok(new MessageResponse("User created successfully"));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get all users")
    @GetMapping("")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Tag(name = "Get")
    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Tag(name = "Put")
    @Operation(summary = "Update user")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String id, @RequestBody @Valid UserRequest updateUserDTO) {
        UserResponse updatedUser = userService.updateUser(id, updateUserDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete user")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable String id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }

    @Tag(name = "Get")
    @Operation(summary = "Confirm account")
    @GetMapping("/confirmation")
    public ResponseEntity<Void> confirmUser(@RequestParam String code) throws SQLIntegrityConstraintViolationException {
        userService.activateAccount(code);
        return ResponseEntity.ok().build();
    }

    @Tag(name = "Post")
    @Operation(summary = "Resend verification email for confirming account")
    @PostMapping("/email")
    public ResponseEntity<Void> reSendVerificationEmail(@RequestParam String email) {
        userService.sendVerificationEmail(email);
        return ResponseEntity.ok().build();
    }

    @Tag(name = "Get")
    @Operation(summary = "Get roles")
    @GetMapping("/roles")
    public ResponseEntity<List<String>> getRoles() {
        return ResponseEntity.ok(userService.getRoles());
    }

    @Tag(name = "Put")
    @Operation(summary = "Approve merchant")
    @PutMapping("/approvement/{id}")
    public ResponseEntity<MessageResponse> approveMerchant(@PathVariable String id) {
        userService.approveMerchant(id);
        return ResponseEntity.ok(new MessageResponse("Merchant approved successfully"));
    }

    @Tag(name = "Delete")
    @Operation(summary = "Reject merchant")
    @DeleteMapping("/rejection/{id}")
    public ResponseEntity<MessageResponse> rejectMerchant(@PathVariable String id, @RequestBody @Valid Rejection rejection) {
        userService.rejectMerchant(id, rejection);
        return ResponseEntity.ok(new MessageResponse("Merchant rejected successfully"));
    }
}
