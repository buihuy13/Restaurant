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
    Queue confirmationQueue() {
        return new Queue("Confirmation_queue", false);
    }
    @Bean
    Queue merchantQueue() {
        return new Queue("Merchant_queue", false);
    }
    @Bean
    TopicExchange confirmationExchange() {
        return new TopicExchange("Confirmation_exchange");
    }
    
    @Bean
    TopicExchange merchantExchange() {
        return new TopicExchange("Merchant_exchange");
    }
    @Bean
    Binding ConfirmationBinding(Queue confirmationQueue, TopicExchange confirmationExchange) {
        return BindingBuilder.bind(confirmationQueue).to(confirmationExchange).with("Confirmation");
    }
    @Bean
    Binding MerchantBinding(Queue merchantQueue, TopicExchange merchantExchange) {
        return BindingBuilder.bind(merchantQueue).to(merchantExchange).with("Merchant");
    }
}
