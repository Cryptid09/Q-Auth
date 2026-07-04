package com.example.users.exception;

/**
 * Thrown when an email verification token is invalid or expired.
 */
public class InvalidTokenException extends AppException {

    public InvalidTokenException() {
        super("Invalid or expired verification token", 400);
    }
}
