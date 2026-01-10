package com.CNTTK18.chat_service.dto.response;

import java.time.ZonedDateTime;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MessageResponseDTO {
    @Id
    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private ZonedDateTime timestamp;
    private boolean read;
}
