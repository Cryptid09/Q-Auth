package com.example.users.exception;

/**
 * Thrown when a registration attempt uses an email that is already registered.
 */
public class DuplicateEmailException extends AppException {

    public DuplicateEmailException(String email) {
        super("Email already registered: " + email, 409);
    }
}
