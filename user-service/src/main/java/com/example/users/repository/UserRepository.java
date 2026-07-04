package com.example.users.repository;

import com.example.users.entity.User;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for User entity operations.
 * Provides type-safe database queries using Panache.
 */
@ApplicationScoped
public class UserRepository implements PanacheRepositoryBase<User, UUID> {

    /**
     * Finds a user by their email address.
     *
     * @param email the email to search for
     * @return an Optional containing the user if found
     */
    public Optional<User> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }

    /**
     * Finds a user by their verification token.
     *
     * @param token the verification token
     * @return an Optional containing the user if found
     */
    public Optional<User> findByVerificationToken(String token) {
        return find("verificationToken", token).firstResultOptional();
    }

    /**
     * Checks if a user with the given email already exists.
     *
     * @param email the email to check
     * @return true if the email is already registered
     */
    public boolean existsByEmail(String email) {
        return count("email", email) > 0;
    }
}
