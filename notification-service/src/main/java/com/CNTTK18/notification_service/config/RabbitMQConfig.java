package com.CNTTK18.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;

@Configuration
public class RabbitMQConfig {
    @Bean
    Queue ConfirmationQueue() {
        return new Queue("Confirmation_queue", false);
    }
    @Bean
    Queue MerchantQueue() {
        return new Queue("Merchant_queue", false);
    }
    @Bean
    Binding ConfirmationBinding(Queue confirmationQueue, TopicExchange confirmationExchange) {
        return BindingBuilder.bind(confirmationQueue).to(confirmationExchange).with("Confirmation");
    }
    @Bean
    Binding MerchantBinding(Queue merchantQueue, TopicExchange merchantExchange) {
        return BindingBuilder.bind(merchantExchange).to(merchantExchange).with("Merchant");
    }
}
