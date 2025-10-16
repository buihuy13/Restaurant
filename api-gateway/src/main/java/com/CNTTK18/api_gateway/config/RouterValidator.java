package com.CNTTK18.api_gateway.config;

import java.util.List;
import java.util.function.Predicate;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;


@Component
public class RouterValidator {
    //List các endpoints không cần thêm authentication filter
    public static final List<String> openApiEndpoints = List.of(
        "/api/users/login",
        "/api/users/register",
        "/eureka/web",
        "/api/users/confirmation",
        "/v3/api-docs/**",
        "/swagger-ui.html",
        "/swagger-ui/**",
        "/api-docs/swagger-ui.html"
    );

    public Predicate<ServerHttpRequest> isSecured =
        request -> openApiEndpoints.stream().noneMatch(uri -> request.getURI().getPath().contains(uri));
}
