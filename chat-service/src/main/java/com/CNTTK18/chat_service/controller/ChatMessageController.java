package com.CNTTK18.chat_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CNTTK18.chat_service.dto.request.roomDTO;
import com.CNTTK18.chat_service.dto.response.Data;
import com.CNTTK18.chat_service.dto.response.ResponseMessage;
import com.CNTTK18.chat_service.dto.response.roomIdResponse;
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

    @GetMapping("/roomId")
    public ResponseEntity<roomIdResponse> getRoomId(roomDTO roomDTO) {
        String roomId = chatMessageService.getRoomId(roomDTO);
        return ResponseEntity.ok(new roomIdResponse(roomId));
    }

    @GetMapping("/rooms/{userId}")
    public ResponseEntity<List<ChatRoom>> findAllRoomByUserId(@PathVariable String userId) {
        List<ChatRoom> chatRooms = chatMessageService.findAllRoomByUserId(userId);
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
    public ResponseEntity<List<Message>> getAllMessageDescInRoom(@PathVariable String roomId) {
        List<Message> messages = chatMessageService.getAllMessageDescInRoom(roomId);
        return ResponseEntity.ok(messages);
    }
}
