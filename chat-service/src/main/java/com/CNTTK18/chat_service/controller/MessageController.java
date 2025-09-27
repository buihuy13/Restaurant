package com.CNTTK18.chat_service.controller;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.CNTTK18.chat_service.dto.MessageDTO;
import com.CNTTK18.chat_service.service.MessageService;

@Controller
public class MessageController {
    private MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }   
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageDTO message) {
        message.setTimestamp(LocalDateTime.now());
        messageService.processMessage(message);
    }
}
