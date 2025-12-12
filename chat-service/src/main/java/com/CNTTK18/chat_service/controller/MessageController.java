package com.CNTTK18.chat_service.controller;

import com.CNTTK18.chat_service.dto.MessageDTO;
import com.CNTTK18.chat_service.service.MessageService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {
    private MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // Gửi tin thì vẫn phải là /app/chat.sendMessage
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Valid @Payload MessageDTO message) {
        message.setTimestamp(LocalDateTime.now());
        messageService.processMessage(message);
    }
}
