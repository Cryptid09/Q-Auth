package com.example.users.service;

import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Service responsible for password hashing and verification using BCrypt.
 * Uses Quarkus Elytron Security Common which generates a unique salt per hash.
 */
@ApplicationScoped
public class PasswordService {

    /**
     * Hashes a plain-text password using BCrypt with a random salt.
     *
     * @param rawPassword the plain-text password
     * @return the BCrypt hash string
     */
    public String hashPassword(String rawPassword) {
        return BcryptUtil.bcryptHash(rawPassword);
    }

    /**
     * Verifies a plain-text password against a BCrypt hash.
     *
     * @param rawPassword the plain-text password to check
     * @param hashedPassword the stored BCrypt hash
     * @return true if the password matches
     */
    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return BcryptUtil.matches(rawPassword, hashedPassword);
    }
}
