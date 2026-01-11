package com.CNTTK18.chat_service.mapper;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import com.CNTTK18.chat_service.dto.response.MessageResponseDTO;
import com.CNTTK18.chat_service.model.Message;

public class MessageMapper {
    public static MessageResponseDTO toMessageResponseDTO(Message message) {
        ZonedDateTime vnZoneTime = message.getTimestamp().atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
        return MessageResponseDTO.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .content(message.getContent())
                .timestamp(vnZoneTime)
                .read(message.isRead())
                .build();
    }
}
