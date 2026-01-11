package com.CNTTK18.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

@Configuration
public class RabbitMQConfig {
    // Dead letter
    private static final String DLX_EXCHANGE = "dead_letter_exchange";
    private static final String DLX_QUEUE = "dead_letter_queue";
    private static final String DLX_KEY = "dead_letter_routingKey";

    private static final String PAYMENT_EXCHANGE = "payment_exchange";
    private static final String PAYMENT_COMPLETED_QUEUE = "payment.completed";

    // Order exchange and queues
    private static final String ORDER_EXCHANGE = "order_exchange";
    private static final String ORDER_REJECTED_QUEUE = "order.rejected";
    private static final String ORDER_ACCEPTED_QUEUE = "order.accepted";
    private static final String ORDER_CANCELLED_BY_MERCHANT_QUEUE = "order.cancelled.by.merchant";

    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        // Cấu hình bỏ qua lỗi khi gặp field lạ
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    Queue confirmationQueue() {
        return QueueBuilder.durable("Confirmation_queue")
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", DLX_KEY)
                .build();
    }

    @Bean
    Queue merchantQueue() {
        return QueueBuilder.durable("Merchant_queue")
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", DLX_KEY)
                .build();
    }

    @Bean
    Queue paymentCompletedQueue() {
        return QueueBuilder.durable(PAYMENT_COMPLETED_QUEUE)
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", DLX_KEY)
                .build();
    }

    // Order queues
    @Bean
    Queue orderRejectedQueue() {
        return QueueBuilder.durable(ORDER_REJECTED_QUEUE)
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", DLX_KEY)
                .build();
    }

    @Bean
    Queue orderAcceptedQueue() {
        return QueueBuilder.durable(ORDER_ACCEPTED_QUEUE)
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", DLX_KEY)
                .build();
    }

    @Bean
    Queue orderCancelledByMerchantQueue() {
        return QueueBuilder.durable(ORDER_CANCELLED_BY_MERCHANT_QUEUE)
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", DLX_KEY)
                .build();
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
    TopicExchange paymentExchange() {
        return new TopicExchange(PAYMENT_EXCHANGE);
    }

    @Bean
    TopicExchange orderExchange() {
        return new TopicExchange(ORDER_EXCHANGE);
    }

    @Bean
    Binding paymentCompletedBinding() {
        return BindingBuilder
                .bind(paymentCompletedQueue())
                .to(paymentExchange())
                .with("payment.completed");
    }
    
    @Bean
    Binding confirmationBinding() {
        return BindingBuilder
                .bind(confirmationQueue())
                .to(confirmationExchange())
                .with("Confirmation");
    }

    @Bean
    Binding merchantBinding() {
        return BindingBuilder
                .bind(merchantQueue())
                .to(merchantExchange())
                .with("Merchant");
    }

    // Order bindings
    @Bean
    Binding orderRejectedBinding() {
        return BindingBuilder
                .bind(orderRejectedQueue())
                .to(orderExchange())
                .with("order.rejected");
    }

    @Bean
    Binding orderAcceptedBinding() {
        return BindingBuilder
                .bind(orderAcceptedQueue())
                .to(orderExchange())
                .with("order.accepted");
    }

    @Bean
    Binding orderCancelledByMerchantBinding() {
        return BindingBuilder
                .bind(orderCancelledByMerchantQueue())
                .to(orderExchange())
                .with("order.cancelled.by.merchant");
    }

    @Bean
    DirectExchange deadLetterExchange() {
        return new DirectExchange(DLX_EXCHANGE);
    }

    @Bean
    Queue deadLetterQueue() {
        return new Queue(DLX_QUEUE, true);
    }

    @Bean
    Binding deadLetterBinding() {
        return BindingBuilder
                .bind(deadLetterQueue())
                .to(deadLetterExchange())
                .with(DLX_KEY);
    }
}