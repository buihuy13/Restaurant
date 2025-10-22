package com.CNTTK18.notification_service.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.apache.tomcat.util.buf.StringUtils;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.CNTTK18.Common.Event.ConfirmationEvent;
import com.CNTTK18.Common.Event.MerchantEvent;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Value("${URL}")
    private String url;

    private final SpringTemplateEngine springTemplateEngine;
    private final JavaMailSender javaMailSender;

    public EmailService(SpringTemplateEngine springTemplateEngine, JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
        this.springTemplateEngine = springTemplateEngine;
    }

    @Value("${spring.mail.username}")
    private String username;

    @RabbitListener(queues = "Confirmation_queue")
    public void sendConfirmationEmail(ConfirmationEvent request) {
        try {
            Context context = new Context();
            Map<String, Object> map = new HashMap<>();
            map.put("name", request.getEmail());
            map.put("url", url+request.getUrl());
            context.setVariables(map);
            String process = springTemplateEngine.process("confirmation", context);
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
            String subject = StringUtils
                    .join(Arrays.asList("Greetings", request.getEmail()), ' ');
            helper.setSubject(subject);
            helper.setText(process, true);
            helper.setTo(request.getEmail());
            helper.setFrom(username);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException | MailException ex) {
            throw new RuntimeException("Lỗi khi gửi mail, " + ex.getMessage(), ex);
        }
    }

    @RabbitListener(queues = "Merchant_queue")
    public void sendMerchantEmail(MerchantEvent request) {
        try {
            Context context = new Context();
            Map<String, Object> map = new HashMap<>();
            map.put("name", request.getEmail());
            map.put("success", request.isSuccess());
            context.setVariables(map);
            String process = springTemplateEngine.process("merchant", context);
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
            String subject = StringUtils
                    .join(Arrays.asList("Greetings", request.getEmail()), ' ');
            helper.setSubject(subject);
            helper.setText(process, true);
            helper.setTo(request.getEmail());
            helper.setFrom(username);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException | MailException ex) {
            throw new RuntimeException("Lỗi khi gửi mail, " + ex.getMessage(), ex);
        }
    }
}
