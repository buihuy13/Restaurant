package com.CNTTK18.user_service.service;

import java.util.Optional;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.Common.Util.SlugGenerator;
import com.CNTTK18.user_service.data.Provider;
import com.CNTTK18.user_service.data.Role;
import com.CNTTK18.user_service.model.Users;
import com.CNTTK18.user_service.repository.UserRepository;

@Service
public class CustomOauth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    public CustomOauth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Lấy các thuộc tính của người dùng từ Google
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Optional<Users> userFound = userRepository.findByEmail(email);
        if (userFound.isEmpty()) {
            Users user = Users.builder()
                    .id(RandomIdGenerator.generate(99))
                    .username(name)
                    .email(email)
                    .role(Role.USER.toString())
                    .enabled(true)
                    .authProvider(Provider.GOOGLE.toString())
                    .slug(SlugGenerator.generate(name))
                    .build();
            userRepository.save(user);
        }
        else {
            Users user = userFound.get();
            if (!user.getAuthProvider().equals(Provider.GOOGLE.toString())) {
                throw new OAuth2AuthenticationException("Please use your " + user.getAuthProvider() + " account to login.");
            }
            user.setUsername(name);
            userRepository.save(user);
        }
        return oAuth2User;
    }
}
