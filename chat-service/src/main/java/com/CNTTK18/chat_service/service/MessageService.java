package com.CNTTK18.chat_service.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.chat_service.dto.MessageDTO;
import com.CNTTK18.chat_service.model.Message;
import com.CNTTK18.chat_service.repository.MessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Service
public class MessageService {
    private static final String REDIS_CHANNEL = "messages";
    
    private MessageRepository messageRepository;
    
    private RedisTemplate<String, Object> redisTemplate;
    
    private final ObjectMapper objectMapper;
    
    public MessageService(MessageRepository messageRepository, RedisTemplate<String, Object> redisTemplate) {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.messageRepository = messageRepository;
        this.redisTemplate = redisTemplate;
    }
    
    public void processMessage(MessageDTO message) {
        // Sử dụng async để không block luồng chính
        saveMessageAsync(message);
        
        // Step 2: Publish to Redis
        publishToRedis(message);
    }
    
    @Async
    public void saveMessageAsync(MessageDTO message) {
        Message msg = Message.builder()
                .id(RandomIdGenerator.generate(254))
                .roomId(message.getRoomId())
                .senderId(message.getSenderId())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
        messageRepository.save(msg);
    }
    
    // Publish to Redis
    private void publishToRedis(MessageDTO message) {
        try {
            String messageJson = objectMapper.writeValueAsString(message);
            redisTemplate.convertAndSend(REDIS_CHANNEL, messageJson);          
        } catch (Exception e) {
            throw new RuntimeException("Error publishing message to Redis", e);
        }
    }
}
