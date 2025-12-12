package com.CNTTK18.notification_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    // Dead letter
    private static final String DLX_EXCHANGE = "dead_letter_exchange";
    private static final String DLX_QUEUE = "dead_letter_queue";
    private static final String DLX_KEY = "dead_letter_routingKey";

    private static final String PAYMENT_EXCHANGE = "payment_exchange";
    private static final String PAYMENT_COMPLETED_QUEUE = "payment.completed";

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
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
    Binding paymentCompletedBinding() {
        return BindingBuilder.bind(paymentCompletedQueue())
                .to(paymentExchange())
                .with("payment.completed");
    }

    @Bean
    Binding confirmationBinding() {
        return BindingBuilder.bind(confirmationQueue())
                .to(confirmationExchange())
                .with("Confirmation");
    }

    @Bean
    Binding merchantBinding() {
        return BindingBuilder.bind(merchantQueue()).to(merchantExchange()).with("Merchant");
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
        return BindingBuilder.bind(deadLetterQueue()).to(deadLetterExchange()).with(DLX_KEY);
    }
}
