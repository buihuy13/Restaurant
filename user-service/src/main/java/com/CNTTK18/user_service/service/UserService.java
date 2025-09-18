package com.CNTTK18.user_service.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.CNTTK18.Common.Exception.ResourceNotFoundException;
import com.CNTTK18.user_service.dto.request.Login;
import com.CNTTK18.user_service.dto.request.Register;
import com.CNTTK18.user_service.dto.request.UserRequest;
import com.CNTTK18.user_service.dto.response.TokenResponse;
import com.CNTTK18.user_service.dto.response.UserResponse;
import com.CNTTK18.user_service.exception.InactivateException;
import com.CNTTK18.user_service.model.Users;
import com.CNTTK18.user_service.repository.UserRepository;
import com.CNTTK18.user_service.util.UserUtil;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, 
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserUtil::mapUsersToUserResponse).toList();
    }

    public UserResponse getUserById(String id) {
        return userRepository.findById(id).map(UserUtil::mapUsersToUserResponse)
                                          .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserResponse updateUser(String id, UserRequest user) {
        Users existingUser = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        userRepository.save(existingUser);
        return new UserResponse(existingUser.getId(),user.getUsername(),user.getEmail(), existingUser.isEnabled(), existingUser.getRole());
    }

    public void deleteUserById(String id) {
        userRepository.deleteById(id);
    }

    public void register(Register user) {
        Users newUser = new Users();
        newUser.setId(java.util.UUID.randomUUID().toString());
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setEnabled(false);
        newUser.setVerficationCode(java.util.UUID.randomUUID().toString());
        newUser.setRole("USER");
        userRepository.save(newUser);
    }

    public TokenResponse login(Login user) {
        @SuppressWarnings("unused")
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        Users existingUsers = userRepository.findByEmail(user.getUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (existingUsers.isEnabled() == false) {
            throw new InactivateException("Your account is not activated. Please activate your account before logging in.");
        }
        return new TokenResponse(jwtService.generateToken(user.getUsername(), existingUsers.getRole()), jwtService.generateRefreshToken(user.getUsername(), existingUsers.getRole()));
    }

    public String refreshAccessToken(String refreshToken) throws Exception {
        return jwtService.refreshAccessToken(refreshToken);
    }

    public UserResponse getUserByAccessToken(String accessToken) throws Exception {
        String username = jwtService.extractUserName(accessToken);
        Users user = userRepository.findById(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserUtil.mapUsersToUserResponse(user);
    }

    public void activateAccount(String code) {
        Users user = userRepository.findByVerficationCode(code).orElseThrow(() -> new ResourceNotFoundException("Invalid verification code"));
        user.setEnabled(true);
        userRepository.save(user);
    }

    public void sendVerificationEmail(String email) {
        Users user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.isEnabled()) {
            throw new IllegalStateException("Account is already activated");
        }
        
        // Gửi email xác thực (chưa làm)
    }
}
