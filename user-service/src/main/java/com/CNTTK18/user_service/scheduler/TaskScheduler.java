package com.CNTTK18.user_service.scheduler;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.CNTTK18.user_service.model.Users;
import com.CNTTK18.user_service.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class TaskScheduler {
    private final UserRepository userRepository;
    public TaskScheduler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //12h đêm mỗi ngày sẽ chạy để check
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteInactivateUsers() {
        Instant thresholdDate = Instant.now().minus(30, ChronoUnit.DAYS);
        List<Users> inactivedUsers = userRepository.findInactiveAccountsOlderThan(thresholdDate);
        log.info("There are " + inactivedUsers.size() + "accounts need to be deleted");
        userRepository.deleteAll(inactivedUsers);
        log.info("Deleted successfully");
    }
}
