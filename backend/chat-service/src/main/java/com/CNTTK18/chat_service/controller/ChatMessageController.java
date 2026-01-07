package com.CNTTK18.chat_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CNTTK18.chat_service.dto.request.RoomDTO;
import com.CNTTK18.chat_service.dto.response.Data;
import com.CNTTK18.chat_service.dto.response.ResponseMessage;
import com.CNTTK18.chat_service.dto.response.RoomIdResponse;
import com.CNTTK18.chat_service.model.ChatRoom;
import com.CNTTK18.chat_service.model.Message;
import com.CNTTK18.chat_service.service.ChatMessageService;

@RestController
@RequestMapping("/api/chat")
public class ChatMessageController {
    private ChatMessageService chatMessageService;

    public ChatMessageController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    @GetMapping("/roomId/{userId1}/{userId2}")
    public ResponseEntity<RoomIdResponse> getRoomId(@PathVariable String userId1, @PathVariable String userId2) {
        RoomDTO roomDTO = new RoomDTO(userId1, userId2);
        String roomId = chatMessageService.getRoomId(roomDTO);
        return ResponseEntity.ok(new RoomIdResponse(roomId));
    }

    @GetMapping("/rooms/{userId}")
    public ResponseEntity<Page<ChatRoom>> findAllRoomByUserId(@PathVariable String userId, Pageable pageable){
        Page<ChatRoom> chatRooms = chatMessageService.findAllRoomByUserId(userId, pageable);
        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/rooms/unreadCount/{userId}")
    public ResponseEntity<Data> countUnreadMessagesByReceiverId(@PathVariable String userId) {
        long count = chatMessageService.countUnreadMessagesByReceiverId(userId);
        return ResponseEntity.ok(new Data(count));
    }

    @GetMapping("/rooms/{roomId}/unreadCount/{userId}")
    public ResponseEntity<Data> countUnreadMessagesByRoomIdAndReceiverId(@PathVariable String roomId, @PathVariable String userId) {
        long count = chatMessageService.countUnreadMessagesByRoomIdAndReceiverId(roomId, userId);
        return ResponseEntity.ok(new Data(count));
    }

    @PutMapping("/rooms/{roomId}/read/{userId}")
    public ResponseEntity<ResponseMessage> markMessagesAsRead(@PathVariable String roomId, @PathVariable String userId) {
        chatMessageService.markMessagesAsRead(roomId, userId);
        return ResponseEntity.ok(new ResponseMessage("Marked as read successfully"));
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<Page<Message>> getAllMessageDescInRoom(@PathVariable String roomId,
                                                                Pageable pageable) {
        Page<Message> messages = chatMessageService.getRecentMessageByPagination(roomId, pageable);
        return ResponseEntity.ok(messages);
    }
}
