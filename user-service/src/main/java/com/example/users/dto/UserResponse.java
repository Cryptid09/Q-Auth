package com.example.users.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Response payload containing user information.
 * Never includes the password hash.
 */
public record UserResponse(
        UUID id,
        String email,
        boolean verified,
        Instant createdAt
) {
}
