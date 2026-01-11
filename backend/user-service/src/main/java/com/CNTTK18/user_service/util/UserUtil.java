package com.CNTTK18.user_service.util;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.stereotype.Component;

import com.CNTTK18.user_service.dto.response.UserResponse;
import com.CNTTK18.user_service.model.Users;

@Component
public class UserUtil {
    public static ZonedDateTime convertToVNZone(Instant instant) {
        return instant.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
    }
    public static UserResponse mapUsersToUserResponse(Users user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.isEnabled(), user.getRole(), user.getPhone(), user.getSlug(),
                                convertToVNZone(user.getCreatedAt()), convertToVNZone(user.getUpdatedAt()));
    }
}
