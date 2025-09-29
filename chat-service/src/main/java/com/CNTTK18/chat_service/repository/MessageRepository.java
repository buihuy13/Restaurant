package com.CNTTK18.chat_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.CNTTK18.chat_service.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    // Lấy 20 tin nhắn gần nhất của 1 room
    List<Message> findTop20ByRoomIdOrderByTimestampDesc(String roomId);
    
    // Lấy tất cả tin nhắn trong room theo thời gian giảm dần
    List<Message> findByRoomIdOrderByTimestampDesc(String roomId);
    
    // Lấy tin nhắn với pagination (offset = limit * page)
    @Query(value = "SELECT * FROM messages WHERE room_id = :roomId ORDER BY timestamp DESC LIMIT :limit OFFSET :offset", 
           nativeQuery = true)
    List<Message> findByRoomIdWithPagination(@Param("roomId") String roomId, 
                                           @Param("offset") int offset, 
                                           @Param("limit") int limit);
    
    // Đếm total messages trong room
    long countByRoomId(String roomId);

    // Đếm tin nhắn chưa đọc trong room cho receiverId
    @Query("SELECT COUNT(m) FROM Message m WHERE m.roomId = :roomId AND m.receiverId = :receiverId AND m.read = false")
    Long countUnreadMessagesByRoomIdAndReceiverId(String roomId, String receiverId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiverId = :receiverId AND m.read = false")
    Long countUnreadMessagesByReceiverId(String receiverId);

    // Cập nhật tất cả tin nhắn trong room cho receiverId thành đã đọc
    @Modifying
    @Query("UPDATE Message m SET m.read = true WHERE m.roomId = :roomId " +
           "AND m.receiverId = :receiverId AND m.read = false")
    void updateReadByRoomIdAndReceiverId(String roomId, String receiverId);
}
