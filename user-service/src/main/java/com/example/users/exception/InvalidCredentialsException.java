package com.example.users.exception;

/**
 * Thrown when login credentials (email or password) are invalid.
 */
public class InvalidCredentialsException extends AppException {

    public InvalidCredentialsException() {
        super("Invalid email or password", 401);
    }
}
