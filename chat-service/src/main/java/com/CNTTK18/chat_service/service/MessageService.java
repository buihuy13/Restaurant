package com.CNTTK18.chat_service.service;

import com.CNTTK18.Common.Exception.ResourceNotFoundException;
import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.chat_service.dto.MessageDTO;
import com.CNTTK18.chat_service.model.ChatRoom;
import com.CNTTK18.chat_service.model.Message;
import com.CNTTK18.chat_service.repository.ChatRoomRepository;
import com.CNTTK18.chat_service.repository.MessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.LocalDateTime;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MessageService {
    private static final String REDIS_CHANNEL = "messages";

    private MessageRepository messageRepository;
    private ChatRoomRepository chatRoomRepository;

    private RedisTemplate<String, Object> redisTemplate;

    private final ObjectMapper objectMapper;

    public MessageService(
            MessageRepository messageRepository,
            RedisTemplate<String, Object> redisTemplate,
            ChatRoomRepository chatRoomRepository) {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.messageRepository = messageRepository;
        this.redisTemplate = redisTemplate;
        this.chatRoomRepository = chatRoomRepository;
    }

    @Transactional
    public void processMessage(MessageDTO message) {
        // Sử dụng async để không block luồng chính
        saveMessageSync(message);

        // Step 2: Publish to Redis
        publishToRedis(message);
    }

    public void saveMessageSync(MessageDTO message) {
        ChatRoom chatroom =
                chatRoomRepository
                        .findById(message.getRoomId())
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Chat room not found: " + message.getRoomId()));
        // Lưu tin nhắn vào database với read = false
        Message msg =
                Message.builder()
                        .id(RandomIdGenerator.generate(254))
                        .room(chatroom)
                        .senderId(message.getSenderId())
                        .receiverId(message.getReceiverId())
                        .content(message.getContent())
                        .timestamp(message.getTimestamp())
                        .read(false)
                        .build();

        // Cập nhật thời gian lastMessageTime và text lastMessage trong ChatRoom
        chatroom.setLastMessageTime(LocalDateTime.now());
        chatroom.setLastMessage(message.getContent());
        chatRoomRepository.save(chatroom);
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
