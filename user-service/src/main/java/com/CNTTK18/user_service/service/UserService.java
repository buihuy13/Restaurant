package com.CNTTK18.user_service.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.CNTTK18.Common.Exception.ResourceNotFoundException;
import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.Common.Util.SlugGenerator;
import com.CNTTK18.user_service.data.Role;
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
import com.CNTTK18.user_service.exception.InactivateException;
import com.CNTTK18.user_service.model.Address;
import com.CNTTK18.user_service.model.Users;
import com.CNTTK18.user_service.repository.AddressRepository;
import com.CNTTK18.user_service.repository.UserRepository;
import com.CNTTK18.user_service.util.AddressUtil;
import com.CNTTK18.user_service.util.UserUtil;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final MailService mailService;
    private final AddressRepository addressRepository;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, 
                       AuthenticationManager authenticationManager, JwtService jwtService, 
                       MailService mailService, AddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.addressRepository = addressRepository;
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
        if (!existingUser.getUsername().equals(user.getUsername())) {
            existingUser.setUsername(user.getUsername());
            existingUser.setSlug(SlugGenerator.generate(user.getUsername()));
        }
        existingUser.setPhone(user.getPhone());
        userRepository.save(existingUser);
        return new UserResponse(existingUser.getId(),user.getUsername(),existingUser.getEmail(), 
                                existingUser.isEnabled(), existingUser.getRole(), user.getPhone(), existingUser.getSlug());
    }

    public UserResponse getUserBySlug(String slug) {
        return userRepository.findBySlug(slug).map(UserUtil::mapUsersToUserResponse)
                                          .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public void deleteUserById(String id) {
        userRepository.deleteById(id);
    }

    public void register(Register user) {
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and Confirm Password do not match");
        }
        Users newUser = new Users();
        newUser.setId(RandomIdGenerator.generate(99));
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setEnabled(false);
        newUser.setVerficationCode(java.util.UUID.randomUUID().toString());
        newUser.setRole(user.getRole());
        newUser.setSlug(SlugGenerator.generate(user.getUsername()));
        userRepository.save(newUser);
        mailService.sendConfirmationEmail(newUser.getEmail(),newUser.getVerficationCode());
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
        String email = jwtService.extractUserName(accessToken);
        Users user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
        mailService.sendConfirmationEmail(email, user.getVerficationCode());
    }

    public List<String> getRoles() {
        return java.util.Arrays.asList(Role.USER.toString(), Role.ADMIN.toString(), Role.MERCHANT.toString());
    }

    public void approveMerchant(String id) {
        Users user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!user.getRole().equals(Role.MERCHANT.toString())) {
            throw new IllegalStateException("User is not a merchant");
        }
        user.setEnabled(true);
        userRepository.save(user);

        mailService.sendMerchantEmail(user.getEmail(), true);
    }

    public void rejectMerchant(String id, Rejection rejection) {
        Users user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!user.getRole().equals(Role.MERCHANT.toString())) {
            throw new IllegalStateException("User is not a merchant");
        }
        userRepository.deleteById(id);
        mailService.sendMerchantEmail(user.getEmail(), false);
    }

    public UserResponse updateUserAfterLogin(UserUpdateAfterLogin userUpdate, String id) {
        Users user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPhone(userUpdate.getPhone());
        Address address = new Address();
        address.setId(RandomIdGenerator.generate(99));
        address.setLocation(userUpdate.getDefaultAddress());
        address.setLatitude(userUpdate.getLatitude());
        address.setLongitude(userUpdate.getLongitude());
        user.addAddress(address);
        Users updatedUser = userRepository.save(user);
        return UserUtil.mapUsersToUserResponse(updatedUser);
    }

    public List<AddressResponse> getUserAddresses(String id) {
        Users user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Address> addresses = user.getAddressList();
        return addresses.stream().map(AddressUtil::mapAddressToAddressResponseWithUserNull).toList();
    }

    public UserResponse resetPassword(Password password, String id) {
        if (!password.getPassword().equals(password.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and Confirm Password do not match"); 
        }
        Users user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(password.getPassword()));
        userRepository.save(user);
        return UserUtil.mapUsersToUserResponse(user);
    }

    public AddressResponse addNewAddress(String id, AddressRequest addressRequest) {
        Users user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Address address = new Address(RandomIdGenerator.generate(250), addressRequest.getLocation(),
                                     addressRequest.getLongitude(),addressRequest.getLatitude());

        user.addAddress(address);
        userRepository.save(user);
        return AddressUtil.mapAddressToAddressResponse(address, user);
    }

    public void deleteAddress(String id) {
        Address address = addressRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        addressRepository.delete(address);
    }

    public String createManagerUser(ManagerRequest user) {
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and Confirm Password do not match");
        }
        Users newUser = new Users();
        newUser.setId(RandomIdGenerator.generate(99));
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setEnabled(true);
        newUser.setVerficationCode(java.util.UUID.randomUUID().toString());
        newUser.setRole(Role.MANAGER.toString());
        newUser.setSlug(SlugGenerator.generate(user.getUsername()));
        userRepository.save(newUser);
        return newUser.getId();
    }
}
