package com.CNTTK18.user_service.repository;

import com.CNTTK18.user_service.model.Users;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
    Optional<Users> findByEmail(String email);

    Optional<Users> findByVerficationCode(String code);

    Optional<Users> findBySlug(String slug);
}
