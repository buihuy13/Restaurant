package com.CNTTK18.user_service.util;

import com.CNTTK18.user_service.dto.response.UserResponse;
import com.CNTTK18.user_service.model.Users;
import org.springframework.stereotype.Component;

@Component
public class UserUtil {
    public static UserResponse mapUsersToUserResponse(Users user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.isEnabled(),
                user.getRole(),
                user.getPhone(),
                user.getSlug());
    }
}
