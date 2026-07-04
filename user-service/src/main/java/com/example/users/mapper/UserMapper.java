package com.example.users.mapper;

import com.example.users.dto.UserResponse;
import com.example.users.entity.User;

/**
 * Maps between User entities and DTOs.
 * Ensures password hashes are never leaked to API responses.
 */
public final class UserMapper {

    private UserMapper() {
        // Utility class — prevent instantiation
    }

    /**
     * Converts a User entity to a UserResponse DTO.
     *
     * @param user the entity to convert
     * @return a safe response DTO without sensitive fields
     */
    public static UserResponse toResponse(User user) {
        return new UserResponse(
                user.id,
                user.email,
                user.verified,
                user.createdAt
        );
    }
}
