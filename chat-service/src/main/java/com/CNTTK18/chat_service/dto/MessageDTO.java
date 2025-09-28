package com.CNTTK18.chat_service.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MessageDTO {
    private String roomId;
    @NotBlank
    private String senderId;
    @NotBlank
    private String receiverId;
    @NotBlank
    private String content;

    private LocalDateTime timestamp;
}
