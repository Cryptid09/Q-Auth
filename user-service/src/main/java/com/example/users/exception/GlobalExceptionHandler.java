package com.example.users.exception;

import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.NotFoundException;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global exception handler that maps application exceptions to meaningful HTTP responses.
 * Uses RESTEasy Reactive's @ServerExceptionMapper for declarative mapping.
 */
public class GlobalExceptionHandler {

    @ServerExceptionMapper
    public RestResponse<Map<String, Object>> handleAppException(AppException ex) {
        return RestResponse.status(
                RestResponse.Status.fromStatusCode(ex.getStatusCode()),
                Map.of("error", ex.getMessage(), "status", ex.getStatusCode())
        );
    }

    @ServerExceptionMapper
    public RestResponse<Map<String, Object>> handleValidation(ConstraintViolationException ex) {
        String errors = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.joining(", "));
        return RestResponse.status(
                RestResponse.Status.BAD_REQUEST,
                Map.of("error", "Validation failed", "details", errors, "status", 400)
        );
    }

    @ServerExceptionMapper
    public RestResponse<Map<String, Object>> handleNotFound(NotFoundException ex) {
        return RestResponse.status(
                RestResponse.Status.NOT_FOUND,
                Map.of("error", "Resource not found", "status", 404)
        );
    }
}
