package com.example.users.service;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for PasswordService BCrypt operations.
 */
@QuarkusTest
class PasswordServiceTest {

    @Inject
    PasswordService passwordService;

    @Test
    void hashPassword_shouldProduceBCryptHash() {
        String hash = passwordService.hashPassword("TestPassword123!");

        assertNotNull(hash);
        assertTrue(hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$"),
                "Hash should be a valid BCrypt hash: " + hash);
    }

    @Test
    void verifyPassword_shouldMatchCorrectPassword() {
        String raw = "MySecurePassword!";
        String hash = passwordService.hashPassword(raw);

        assertTrue(passwordService.verifyPassword(raw, hash));
    }

    @Test
    void verifyPassword_shouldNotMatchWrongPassword() {
        String hash = passwordService.hashPassword("CorrectPassword");

        assertFalse(passwordService.verifyPassword("WrongPassword", hash));
    }

    @Test
    void hashPassword_shouldGenerateUniqueSalts() {
        String hash1 = passwordService.hashPassword("SamePassword");
        String hash2 = passwordService.hashPassword("SamePassword");

        assertNotEquals(hash1, hash2,
                "Each hash should use a unique salt, producing different outputs");
    }
}
