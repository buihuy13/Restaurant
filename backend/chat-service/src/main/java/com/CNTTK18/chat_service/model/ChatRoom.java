package com.CNTTK18.chat_service.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoom {
    @Id
    private String id;
    @Column(name = "user1_id")
    private String user1Id;
    @Column(name = "user2_id")
    private String user2Id;
    @Column(name = "last_message_time")
    private LocalDateTime lastMessageTime;

    @Column(name = "last_message")
    private String lastMessage;
}
