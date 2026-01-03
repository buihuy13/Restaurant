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
            criteriaBuilder.equal(root.get("enabled"), isEnabled);
    }

    public static Specification<Users> hasNameLike(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(root.get("username"), "%" + name + "%");
        };
    }

    public static Specification<Users> hasAuthProvider(String authProvider) {
        return (root, query, criteriaBuilder) -> {
            if (authProvider == null || authProvider.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("authProvider"), authProvider);
        };
    }

    public static Specification<Users> allSpecification(String role, Boolean isEnabled, String name, String authProvider) {
        return Specification.allOf(hasRole(role))
                            .and(isEnabled(isEnabled))
                            .and(hasNameLike(name))
                            .and(hasAuthProvider(authProvider));
    }
}
