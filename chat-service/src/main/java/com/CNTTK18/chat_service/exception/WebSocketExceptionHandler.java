package com.CNTTK18.chat_service.exception;

import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

public class WebSocketExceptionHandler extends StompSubProtocolErrorHandler {
    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {
        
        // Log lỗi ở đây
        System.err.println("Lỗi khi xử lý message WebSocket: " + ex.getMessage());

        if (clientMessage != null) {
            System.err.println("Client message: " + new String(clientMessage.getPayload()));
        }

        // Tạo một message lỗi để gửi lại cho client
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);
        accessor.setMessage(ex.getMessage());
        accessor.setLeaveMutable(true);

        return MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());
    }
}
