package com.CNTTK18.chat_service.config;

import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.lang.Nullable;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.CNTTK18.chat_service.service.RedisService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class WebsocketHandshakeInterceptor implements HandshakeInterceptor {
    private final RedisService redisService;

    public WebsocketHandshakeInterceptor(RedisService redisService) {
        this.redisService = redisService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {
        
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            String token = servletRequest.getServletRequest().getParameter("token");
            if (token == null || token.isEmpty()) {
                return false; //Không cho kết nối
            }
            if (redisService.exists(token)) {
                return false;
            }

            redisService.setValue(token, true);
            return true;
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            @Nullable Exception exception) {
        log.info("Connect successfully");
    }
}
