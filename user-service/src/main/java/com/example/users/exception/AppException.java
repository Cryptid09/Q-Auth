package com.example.users.exception;

/**
 * Base application exception for the user service.
 */
public class AppException extends RuntimeException {

    private final int statusCode;

    public AppException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
