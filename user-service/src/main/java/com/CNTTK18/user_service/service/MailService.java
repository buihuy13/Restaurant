package com.CNTTK18.user_service.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.CNTTK18.Common.Event.ConfirmationEvent;
import com.CNTTK18.Common.Event.MerchantEvent;

@Service
public class MailService {
    private final RabbitTemplate rabbitTemplate;

    public MailService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Async
    public void sendConfirmationEmail(String email, String verificationCode) {
        ConfirmationEvent ce =  new ConfirmationEvent(email, "api/users/confirmation?code=" + verificationCode);
        rabbitTemplate.convertAndSend("Confirmation_exchange", "Confirmation", ce);
    }

    @Async
    public void sendConfirmationEmailAgain(String email, String verificationCode) {
        ConfirmationEvent ce =  new ConfirmationEvent(email, "api/users/confirmation?code=" + verificationCode);
        rabbitTemplate.convertAndSend("Confirmation_exchange", "Confirmation", ce);
    }

    @Async
    public void sendMerchantEmail(String email, boolean success) {
        MerchantEvent me = new MerchantEvent(email, success);
        rabbitTemplate.convertAndSend("Merchant_exchange", "Merchant", me);
    }
}
