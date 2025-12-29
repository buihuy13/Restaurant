package com.CNTTK18.user_service.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.CNTTK18.user_service.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, String>, JpaSpecificationExecutor<Users> {
    Optional<Users> findByEmail(String email);

    Optional<Users> findByVerficationCode(String code);

    Optional<Users> findBySlug(String slug);

    @Query("SELECT u FROM Users u WHERE u.enabled = false " +
           "AND u.createdAt <= :thresholdDate")
    List<Users> findInactiveAccountsOlderThan(@Param("thresholdDate") Instant thresholdDate);
}
