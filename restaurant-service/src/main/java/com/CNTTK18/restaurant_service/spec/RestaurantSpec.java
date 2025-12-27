package com.CNTTK18.restaurant_service.spec;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.CNTTK18.restaurant_service.model.categories;
import com.CNTTK18.restaurant_service.model.restaurants;

import jakarta.persistence.criteria.Join;

public class RestaurantSpec {
    public static Specification<restaurants> hasNameLike(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(root.get("resName"), "%" + name + "%");
        };
    }

    public static Specification<restaurants> isEnabled(Boolean enabled) {
        return (root, query, criteriaBuilder) -> {
            if (enabled == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("enabled"), enabled);
        };
    }

    public static Specification<restaurants> hasCategory(List<String> categories) {
        return (root, query, criteriaBuilder) -> {
            if (categories == null || categories.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            Join<restaurants, categories> categoryJoin = root.join("categories");
            return criteriaBuilder.lower(categoryJoin.get("cateName")).in(categories.stream().map(String::toLowerCase).toList());
        };
    }

    public static Specification<restaurants> allSpecification(String name, Boolean enabled, List<String> categories) {
        return Specification.allOf(hasNameLike(name))
                            .and(isEnabled(enabled))
                            .and(hasCategory(categories));
    }
}
