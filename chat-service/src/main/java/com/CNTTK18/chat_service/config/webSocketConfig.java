package com.CNTTK18.chat_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class webSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple broker for topics (in-memory broker)
        // server gửi message đến client có tiền tố /topic
        config.enableSimpleBroker("/topic");

        // Set prefix for client messages (server nhận message từ client)
        // Bất kì tin nhắn nào gửi đến server có tiền tố /app sẽ được xử lý bởi các @MessageMapping
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // endpoint tại /ws, client sẽ kết nối tới đây
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // Phòng khi trình duyệt cũ không hỗ trợ WebSocket
    }
}
