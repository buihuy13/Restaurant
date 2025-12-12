package com.CNTTK18.chat_service.config;

import com.CNTTK18.chat_service.dto.MessageDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisMessageSubscriber {

    private static final Logger logger = LoggerFactory.getLogger(RedisMessageSubscriber.class);

    // Sử dụng để kết nối từ redis qua websocket client
    private SimpMessagingTemplate messagingTemplate;

    private final ObjectMapper objectMapper;

    public RedisMessageSubscriber(SimpMessagingTemplate messagingTemplate) {
        this.objectMapper = new ObjectMapper();
        // Hướng dẫn objectMapper các chuyển đổi các đối tượng LocalDateTime để dễ đọc hơn
        this.objectMapper.registerModule(new JavaTimeModule());
        this.messagingTemplate = messagingTemplate;
    }

    // Phương thức nhận từ redisConfig và forward cho các websocket clients
    public void receiveMessage(String message) {
        try {
            logger.debug("Received from Redis: {}", message);

            // Chuyển từ Json qua Message
            MessageDTO chatMessage = objectMapper.readValue(message, MessageDTO.class);

            // Forward đến các clients qua WebSocket (Gửi đến các client đang subscribe topic của
            // room có giá trị là destination)
            String destination = "/topic/room/" + chatMessage.getRoomId();
            messagingTemplate.convertAndSend(destination, chatMessage);

            logger.debug("Forwarded to WebSocket topic: {}", destination);

        } catch (Exception e) {
            logger.error("Error processing Redis message", e);
        }
    }
}
