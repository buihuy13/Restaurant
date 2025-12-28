package com.CNTTK18.chat_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class webSocketConfig implements WebSocketMessageBrokerConfigurer  {
    private final WebsocketHandshakeInterceptor handshakeInterceptor;

    public webSocketConfig(WebsocketHandshakeInterceptor handshakeInterceptor) {
        this.handshakeInterceptor = handshakeInterceptor;
    }

    @Bean
    public TaskScheduler customMessageBrokerTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(1); //app nhỏ không cần nhiều thread (non blocking I/O)
        scheduler.setThreadNamePrefix("ws-heartbeat-thread");
        scheduler.setDaemon(true); // không ngăn JVM tắt
        scheduler.initialize();
        return scheduler;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple broker for topics (in-memory broker)
        // server gửi message đến client có tiền tố /topic
        config.enableSimpleBroker("/topic")
              .setHeartbeatValue(new long[] {20000, 30000})
              .setTaskScheduler(customMessageBrokerTaskScheduler());
        
        // Set prefix for client messages (server nhận message từ client)
        // Bất kì tin nhắn nào gửi đến server có tiền tố /app sẽ được xử lý bởi các @MessageMapping
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // endpoint tại /ws, client sẽ kết nối tới đây
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .addInterceptors(handshakeInterceptor);
    }
}
