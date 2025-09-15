package com.CNTTK18.api_gateway.filter;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.CNTTK18.api_gateway.config.RouterValidator;
import com.CNTTK18.api_gateway.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationGatewayFilterFactory extends AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> {

    private final JwtUtil jwtUtil;
    private final RouterValidator routerValidator;
    
    public JwtAuthenticationGatewayFilterFactory(JwtUtil jwtUtil, RouterValidator routerValidator) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
        this.routerValidator = routerValidator;
    }

    public static class Config {
        private String requiredRole;
        
        public String getRequiredRole() {
            return requiredRole;
        }
        public void setRequiredRole(String role) {
            this.requiredRole = role;
        }
    }

    private Mono<Void> onError(ServerWebExchange exchange, int statusCode, String message)
    {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatusCode.valueOf(statusCode));
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", new Date());
        errorResponse.put("status", statusCode);
        errorResponse.put("error", HttpStatus.valueOf(statusCode).getReasonPhrase());
        errorResponse.put("message", message);
        errorResponse.put("path", exchange.getRequest().getURI().getPath());
        try {
            ObjectMapper mapper = new ObjectMapper();
            byte[] bytes = mapper.writeValueAsBytes(errorResponse);
            DataBuffer buffer = response.bufferFactory().wrap(bytes);
            return response.writeWith(Mono.just(buffer));
        }
        catch (Exception e) {
            return response.setComplete();
        }
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            // Kiểm tra xem request có cần xác thực không
            if (routerValidator.isSecured.test(exchange.getRequest())) {
                // Kiểm tra header có chứa token không
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    return onError(exchange, 401, "Header không chứa token");
                }

                String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7); // Bỏ "Bearer "
                }
                else {
                    return onError(exchange, 401, "Token lỗi");
                }

                try {
                    // Xác thực token
                    boolean result = jwtUtil.validateToken(authHeader);
                    if (!result) {
                        return onError(exchange, 401, "Token lỗi");
                    }
                } catch (Exception e) {
                    return onError(exchange, 401, e.getMessage());
                }

                String requiredRole = config.getRequiredRole();
                // Nếu route này có yêu cầu quyền cụ thể
                if (requiredRole != null && !requiredRole.isEmpty()) {
                    String userRoles = jwtUtil.extractRole(authHeader);
                    
                    // Kiểm tra xem người dùng có quyền yêu cầu không
                    if (userRoles == null || !userRoles.equals(requiredRole)) {
                        return onError(exchange, 403, "Không có quyền");
                    }
                }
            }
            return chain.filter(exchange);
        });
    }
}
