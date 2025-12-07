package com.CNTTK18.user_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.CNTTK18.user_service.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, String>, JpaSpecificationExecutor<Users> {
    Optional<Users> findByEmail(String email);

    Optional<Users> findByVerficationCode(String code);

    Optional<Users> findBySlug(String slug);
}
