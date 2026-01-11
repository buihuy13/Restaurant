package com.CNTTK18.notification_service.service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.CNTTK18.Common.Event.OrderEvent;

@Service
public class SSEService {
    // Vì web chỉ có 1 instance
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private static final long TIME_OUT = 30 * 60 * 1000L; // 30p
    
    public SseEmitter createEmitter(String userId) {
        SseEmitter emitter = new SseEmitter(TIME_OUT);
        
        this.emitters.put(userId, emitter);

        emitter.onCompletion(() -> this.emitters.remove(userId));
        emitter.onTimeout(() -> this.emitters.remove(userId));
        emitter.onError((e) -> this.emitters.remove(userId));

        // Gửi event đầu tiên để confirm connection
        try {
            System.out.println("Connection established for user: " + userId);
            emitter.send(SseEmitter.event().name("INIT").data("Connection established"));
        } catch (Exception e) {
            System.out.println("Error sending INIT event to user: " + userId);
            this.emitters.remove(userId);
        }
        return emitter;
    }

    @Scheduled(fixedRate = 20000)
    public void sendHeartbeat() {
        if (emitters.isEmpty()) return;

        // Dùng entrySet để vừa duyệt vừa lấy key/value
        for (Map.Entry<String, SseEmitter> entry : emitters.entrySet()) {
            String userId = entry.getKey();
            SseEmitter emitter = entry.getValue();
            try {
                // Giữ connection
                emitter.send(SseEmitter.event().name("PING").data("keep-alive"));
            } catch (IOException e) {
                this.emitters.remove(userId); 
            }
        }
    }

    @RabbitListener(queues = "order.accepted")
    public void sendSuccessOrderEventToUser(OrderEvent orderEvent) {
        String userId = orderEvent.getUserId();
        String restaurantName = orderEvent.getRestaurantName();
        SseEmitter emitter = this.emitters.get(userId);
        String message = restaurantName + "accepted your order";
        if (emitter != null) {
            try {
                System.out.println("Sending success order event " + " to user: " + userId);
                emitter.send(SseEmitter.event().name("Order Successfully").data(message));
            } catch (Exception e) {
                System.out.println("Error sending success event to user: " + userId);
                this.emitters.remove(userId);
            }
        }
    }

    @RabbitListener(queues = {"order.rejected", "order.cancelled.by.merchant"})
    public void sendRejectedOrderEventToUser(OrderEvent orderEvent) {
        String userId = orderEvent.getUserId();
        String restaurantName = orderEvent.getRestaurantName();
        SseEmitter emitter = this.emitters.get(userId);
        String message = restaurantName + "rejected your order";
        if (emitter != null) {
            try {
                System.out.println("Sending rejected order event " + " to user: " + userId);
                emitter.send(SseEmitter.event().name("Order Failed").data(message));
            } catch (Exception e) {
                System.out.println("Error sending rejected event to user: " + userId);
                this.emitters.remove(userId);
            }
        }
    }
}
