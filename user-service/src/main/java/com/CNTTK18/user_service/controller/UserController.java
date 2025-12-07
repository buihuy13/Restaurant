package com.CNTTK18.user_service.controller;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CNTTK18.user_service.data.Role;
import com.CNTTK18.user_service.dto.request.AddressRequest;
import com.CNTTK18.user_service.dto.request.Login;
import com.CNTTK18.user_service.dto.request.Password;
import com.CNTTK18.user_service.dto.request.Register;
import com.CNTTK18.user_service.dto.request.Rejection;
import com.CNTTK18.user_service.dto.request.UserRequest;
import com.CNTTK18.user_service.dto.request.UserUpdateAfterLogin;
import com.CNTTK18.user_service.dto.response.AddressResponse;
import com.CNTTK18.user_service.dto.response.TokenResponse;
import com.CNTTK18.user_service.dto.response.UserResponse;
import com.CNTTK18.user_service.exception.ForbiddenException;
import com.CNTTK18.user_service.model.UserPrinciple;
import com.CNTTK18.user_service.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    public ResponseEntity<TokenResponse> login(@RequestBody @Valid Login login, HttpServletResponse response) {
        TokenResponse token = userService.login(login, response);
        return ResponseEntity.ok(token);
    }

    @Tag(name = "Post")
    @Operation(summary = "Logout")
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletResponse response) {
        userService.logoutUser(response);
        return ResponseEntity.ok(new MessageResponse("User logged out successfully"));
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
    @Operation(summary = "Get user by access token")
    @GetMapping("/accesstoken")
    public ResponseEntity<UserResponse> getUserByAccessToken(@AuthenticationPrincipal UserPrinciple user) {
        return ResponseEntity.ok(userService.getUserById(user.getId()));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get new access token by refresh token")
    @GetMapping("/refreshtoken")
    public ResponseEntity<MessageResponse> getNewAccessToken(HttpServletRequest request) throws Exception {
        return ResponseEntity.ok(new MessageResponse(userService.refreshAccessToken(request)));
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
    public ResponseEntity<UserResponse> updateUser(@AuthenticationPrincipal UserPrinciple user, @PathVariable String id, 
                                                    @RequestBody @Valid UserRequest updateUserDTO) {

        String role = user.getAuthorities().stream().findFirst().get().getAuthority();
        if (!user.getId().equals(id) && !role.equals(Role.ADMIN.toString())) {
            throw new ForbiddenException("You are not allowed to update this user.");
        }
        UserResponse updatedUser = userService.updateUser(id, updateUserDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete user")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@AuthenticationPrincipal UserPrinciple user, @PathVariable String id) {
        String role = user.getAuthorities().stream().findFirst().get().getAuthority().toString();
        if (!user.getId().equals(id) && !role.equals(Role.ADMIN.toString())) {
            throw new ForbiddenException("You are not allowed to update this user.");
        }
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

    @Tag(name = "Post")
    @Operation(summary = "Added new address for user")
    @PostMapping("/address/{id}")
    public ResponseEntity<AddressResponse> addNewAddress(@PathVariable String id, @RequestBody @Valid AddressRequest addressRequest) {
        return new ResponseEntity<>(userService.addNewAddress(id, addressRequest), HttpStatusCode.valueOf(201));
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
    public ResponseEntity<MessageResponse> rejectMerchant(@PathVariable String id, @RequestBody @Valid Rejection rejection) {
        userService.rejectMerchant(id, rejection);
        return ResponseEntity.ok(new MessageResponse("Merchant rejected successfully"));
    }

    @Tag(name = "Put")
    @Operation(summary = "Update user after login")
    @PutMapping("/profile/{id}")
    public ResponseEntity<UserResponse> updateUserAfterLogin(@AuthenticationPrincipal UserPrinciple user, @PathVariable String id, @RequestBody @Valid UserUpdateAfterLogin userUpdate) {
        String role = user.getAuthorities().stream().findFirst().get().getAuthority().toString();
        if (!user.getId().equals(id) && !role.equals(Role.ADMIN.toString())) {
            throw new ForbiddenException("You are not allowed to update this user.");
        }
        UserResponse updatedUser = userService.updateUserAfterLogin(userUpdate, id);
        return ResponseEntity.ok(updatedUser);
    }

    @Tag(name = "Put")
    @Operation(summary = "Update password")
    @PutMapping("/password/{id}")
    public ResponseEntity<UserResponse> resetPassword(@AuthenticationPrincipal UserPrinciple user, @PathVariable String id, @RequestBody @Valid Password password) {
        String role = user.getAuthorities().stream().findFirst().get().getAuthority().toString();
        if (!user.getId().equals(id) && !role.equals(Role.ADMIN.toString())) {
            throw new ForbiddenException("You are not allowed to update this user.");
        }
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

    @Tag(name = "Get")
    @Operation(summary = "Get merchant list need approvement")
    @GetMapping("/merchants/consideration")
    public ResponseEntity<List<UserResponse>> getMerchantListNeedApprovement() {
        return ResponseEntity.ok(userService.getMerchantListNeedApprovement());
    }
}
