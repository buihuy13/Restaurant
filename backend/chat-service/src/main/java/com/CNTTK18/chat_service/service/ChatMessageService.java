package com.CNTTK18.chat_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.CNTTK18.chat_service.dto.request.RoomDTO;
import com.CNTTK18.chat_service.model.ChatRoom;
import com.CNTTK18.chat_service.model.Message;
import com.CNTTK18.chat_service.repository.ChatRoomRepository;
import com.CNTTK18.chat_service.repository.MessageRepository;

import jakarta.transaction.Transactional;

@Service
public class ChatMessageService {
    private MessageRepository messageRepository;
    private ChatRoomRepository chatRoomRepository;

    public ChatMessageService(MessageRepository messageRepository, ChatRoomRepository chatRoomRepository) {
        this.messageRepository = messageRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    // Tạo room nếu chưa có, trả về roomId
    public String getRoomId(RoomDTO roomDTO) {
        String roomId = roomDTO.getUserId1() + "_" + roomDTO.getUserId2();

        if (roomDTO.getUserId1().compareTo(roomDTO.getUserId2()) > 0) {
            if (chatRoomRepository.findById(roomId).isEmpty()) {
                chatRoomRepository.save(new ChatRoom(
                roomId,
                roomDTO.getUserId1(),
                roomDTO.getUserId2(),
                null,
                null ));
            }
            return roomId;
        }
        roomId = roomDTO.getUserId2() + "_" + roomDTO.getUserId1();
        if (chatRoomRepository.findById(roomId).isEmpty()) {
            chatRoomRepository.save(new ChatRoom(
            roomId,
            roomDTO.getUserId2(),
            roomDTO.getUserId1(),
            null,
            null ));
        }
        return roomId;
    }

    public Page<Message> getRecentMessageByPagination(String roomId, Pageable pageable) {
        return messageRepository.findByRoomIdWithPagination(roomId, pageable);
    }

    // Lấy tất cả room có userId tham gia
    public Page<ChatRoom> findAllRoomByUserId(String userId, Pageable pageable) {
        return chatRoomRepository.findAllByUserId(userId, pageable);
    }

    // Đếm số tin nhắn chưa đọc trong box chat của userId
    public long countUnreadMessagesByReceiverId(String receiverId) {
        return messageRepository.countUnreadMessagesByReceiverId(receiverId);
    }

    // Đếm số tin nhắn chưa đọc trong room cho receiverId
    public long countUnreadMessagesByRoomIdAndReceiverId(String roomId, String receiverId) {
        return messageRepository.countUnreadMessagesByRoomIdAndReceiverId(roomId, receiverId);
    }

    // Đánh dấu tất cả tin nhắn trong room là đã đọc
    @Transactional
    public void markMessagesAsRead(String roomId, String receiverId) {
        messageRepository.updateReadByRoomIdAndReceiverId(roomId, receiverId);
    }
}
