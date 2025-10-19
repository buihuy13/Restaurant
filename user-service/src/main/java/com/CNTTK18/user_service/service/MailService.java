package com.CNTTK18.user_service.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.CNTTK18.Common.Event.ConfirmationEvent;
import com.CNTTK18.Common.Event.MerchantEvent;

@Service
public class MailService {
    private final KafkaTemplate kafkaTemplate;

    public MailService(KafkaTemplate kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Async
    public void sendConfirmationEmail(String email, String verificationCode) {
        kafkaTemplate.send("confirmationTopic", new ConfirmationEvent(email, 
                                        "api/users/confirmation?code=" + verificationCode));
    }

    @Async
    public void sendConfirmationEmailAgain(String email, String verificationCode) {
        kafkaTemplate.send("confirmationTopic", new ConfirmationEvent(email, "api/users/confirmation?code=" + verificationCode));
    }

    @Async
    public void sendMerchantEmail(String email, boolean success) {
        kafkaTemplate.send("Merchant", new MerchantEvent(email, success));
    }
}
