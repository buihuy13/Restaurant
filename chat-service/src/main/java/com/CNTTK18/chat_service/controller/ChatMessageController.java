package com.CNTTK18.chat_service.controller;

import org.springframework.web.bind.annotation.RestController;

import com.CNTTK18.chat_service.service.ChatMessageService;

@RestController
public class ChatMessageController {
    private ChatMessageService chatMessageService;

    public ChatMessageController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }
}
