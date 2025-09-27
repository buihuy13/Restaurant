package com.CNTTK18.chat_service.service;

import org.springframework.stereotype.Service;

import com.CNTTK18.chat_service.repository.MessageRepository;

@Service
public class ChatMessageService {
    private MessageRepository messageRepository;

    public ChatMessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    
}
