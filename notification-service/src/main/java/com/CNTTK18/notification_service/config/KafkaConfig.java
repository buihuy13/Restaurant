package com.CNTTK18.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {

    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(template);
        
        // Cấu hình thử lại 2 lần (tổng cộng 3 lần thực thi) với khoảng chờ 1 giây giữa mỗi lần.
        FixedBackOff backOff = new FixedBackOff(1000L, 2);

        // Tạo ErrorHandler mới với cấu hình trên
        return new DefaultErrorHandler(recoverer, backOff);
    }
}
