package com.CNTTK18.chat_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.CNTTK18.chat_service.model.ChatRoom;

import io.lettuce.core.dynamic.annotation.Param;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    @Query("select m.user1Id, m.user2Id from ChatRoom m where m.user1Id = :userId or m.user2Id = :userId " +
                                "order by m.lastMessageTime desc")
    List<Object[]> findUsersIdChatWithUser(@Param("userId") String userId);

    @Query("select m from ChatRoom m where m.user1Id = :userId or m.user2Id = :userId " +
                                "order by m.lastMessageTime desc")
    List<ChatRoom> findAllByUserId(@Param("userId") String userId);
}
