package com.CNTTK18.chat_service.service;

import java.util.List;

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

    // Lấy tất cả tin nhắn trong room theo thời gian giảm dần
    public List<Message> getAllMessageDescInRoom(String roomId) {
        return messageRepository.findByRoomIdOrderByTimestampDesc(roomId);
    }

    // Lấy 20 tin nhắn gần nhất của 1 room
    public List<Message> getRecentMessageByPagination(String roomId, int page, int limit) {
        int offset = page * limit;
        return messageRepository.findByRoomIdWithPagination(roomId, offset, limit);
    }

    // Lấy tất cả room có userId tham gia
    public List<ChatRoom> findAllRoomByUserId(String userId) {
        return chatRoomRepository.findAllByUserId(userId);
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
