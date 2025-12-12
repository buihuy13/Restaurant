package com.CNTTK18.user_service.controller;

import com.CNTTK18.user_service.dto.request.AddressRequest;
import com.CNTTK18.user_service.dto.request.Login;
import com.CNTTK18.user_service.dto.request.ManagerRequest;
import com.CNTTK18.user_service.dto.request.Password;
import com.CNTTK18.user_service.dto.request.Register;
import com.CNTTK18.user_service.dto.request.Rejection;
import com.CNTTK18.user_service.dto.request.UserRequest;
import com.CNTTK18.user_service.dto.request.UserUpdateAfterLogin;
import com.CNTTK18.user_service.dto.response.AddressResponse;
import com.CNTTK18.user_service.dto.response.TokenResponse;
import com.CNTTK18.user_service.dto.response.UserResponse;
import com.CNTTK18.user_service.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    record MessageResponse(String message) {}

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

    @Tag(name = "Post")
    @Operation(summary = "Create manager")
    @PostMapping("/manager")
    public ResponseEntity<String> createManager(@RequestBody @Valid ManagerRequest user) {
        String id = userService.createManagerUser(user);
        return ResponseEntity.ok(id);
    }

    @Tag(name = "Get")
    @Operation(summary = "Get all users")
    @GetMapping("")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Tag(name = "Get")
    @Operation(summary = "Get user by access token")
    @GetMapping("/accesstoken")
    public ResponseEntity<UserResponse> getUserByAccessToken(
            @RequestHeader("Authorization") String authHeader) throws Exception {
        if (authHeader.startsWith("Bearer")) {
            authHeader = authHeader.substring(7);
        }
        return ResponseEntity.ok(userService.getUserByAccessToken(authHeader));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get new access token by refresh token")
    @GetMapping("/refreshtoken")
    public ResponseEntity<MessageResponse> getNewAccessToken(
            @RequestHeader("Refresh-Token") String authHeader) throws Exception {
        if (authHeader.startsWith("Bearer")) {
            authHeader = authHeader.substring(7);
        }
        return ResponseEntity.ok(new MessageResponse(userService.refreshAccessToken(authHeader)));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get user by ID")
    @GetMapping("/admin/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get user by slug")
    @GetMapping("/{slug}")
    public ResponseEntity<UserResponse> getUserBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(userService.getUserBySlug(slug));
    }

    @Tag(name = "Put")
    @Operation(summary = "Update user")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String id, @RequestBody @Valid UserRequest updateUserDTO) {
        UserResponse updatedUser = userService.updateUser(id, updateUserDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @Tag(name = "Put")
    @Operation(summary = "Update role from user to merchant")
    @PutMapping("/merchant/{id}")
    public ResponseEntity<MessageResponse> updateUserToMerchant(@PathVariable String id) {
        userService.upgradeUserToMerchant(id);
        return ResponseEntity.ok(new MessageResponse("Update successfully"));
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
    public ResponseEntity<Void> confirmUser(@RequestParam String code)
            throws SQLIntegrityConstraintViolationException {
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

    @Tag(name = "Post")
    @Operation(summary = "Added new address for user")
    @PostMapping("/address/{id}")
    public ResponseEntity<AddressResponse> addNewAddress(
            @PathVariable String id, @RequestBody @Valid AddressRequest addressRequest) {
        return new ResponseEntity<>(
                userService.addNewAddress(id, addressRequest), HttpStatusCode.valueOf(201));
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete address")
    @DeleteMapping("/address/{id}")
    public ResponseEntity<MessageResponse> deleteAddress(@PathVariable String id) {
        userService.deleteAddress(id);
        return ResponseEntity.ok(new MessageResponse("Delete successfully"));
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
    public ResponseEntity<MessageResponse> rejectMerchant(
            @PathVariable String id, @RequestBody @Valid Rejection rejection) {
        userService.rejectMerchant(id, rejection);
        return ResponseEntity.ok(new MessageResponse("Merchant rejected successfully"));
    }

    @Tag(name = "Put")
    @Operation(summary = "Update user after login")
    @PutMapping("/profile/{id}")
    public ResponseEntity<UserResponse> updateUserAfterLogin(
            @PathVariable String id, @RequestBody @Valid UserUpdateAfterLogin userUpdate) {
        UserResponse updatedUser = userService.updateUserAfterLogin(userUpdate, id);
        return ResponseEntity.ok(updatedUser);
    }

    @Tag(name = "Put")
    @Operation(summary = "Update password")
    @PutMapping("/password/{id}")
    public ResponseEntity<UserResponse> resetPassword(
            @PathVariable String id, @RequestBody @Valid Password password) {
        UserResponse updatedUser = userService.resetPassword(password, id);
        return ResponseEntity.ok(updatedUser);
    }

    @Tag(name = "Get")
    @Operation(summary = "Get user addresses")
    @GetMapping("/addresses/{id}")
    public ResponseEntity<List<AddressResponse>> getUserAddresses(@PathVariable String id) {
        List<AddressResponse> addresses = userService.getUserAddresses(id);
        return ResponseEntity.ok(addresses);
    }
}
