package com.CNTTK18.user_service.spec;

import org.springframework.data.jpa.domain.Specification;

import com.CNTTK18.user_service.model.Users;

public class UserSpecification {
    public static Specification<Users> hasRole(String role) {
        return (root, query, criteriaBuilder) -> {
            if (role == null || role.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("role"), role);
        };
    }

    public static Specification<Users> isEnabled(Boolean isEnabled) {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(root.get("isEnabled"), isEnabled);
    }
}
