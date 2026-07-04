package com.example.users.util;

import java.util.UUID;

/**
 * Utility for generating secure random tokens.
 */
public final class TokenGenerator {

    private TokenGenerator() {
        // Utility class — prevent instantiation
    }

    /**
     * Generates a cryptographically random UUID-based token.
     *
     * @return a unique token string
     */
    public static String generate() {
        return UUID.randomUUID().toString();
    }
}
