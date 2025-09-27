package com.CNTTK18.chat_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CNTTK18.chat_service.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {

}
