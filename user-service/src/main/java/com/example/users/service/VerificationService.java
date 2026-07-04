package com.example.users.service;

import com.example.users.config.AppConfig;
import com.example.users.util.TokenGenerator;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * Service responsible for generating and managing email verification tokens.
 */
@ApplicationScoped
public class VerificationService {

    private final AppConfig appConfig;

    @Inject
    public VerificationService(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    /**
     * Generates a new unique verification token.
     *
     * @return a UUID-based verification token
     */
    public String generateToken() {
        return TokenGenerator.generate();
    }

    /**
     * Builds the full verification URL that will be embedded in the email.
     *
     * @param token the verification token
     * @return the complete verification URL
     */
    public String buildVerificationUrl(String token) {
        return appConfig.baseUrl() + "?token=" + token;
    }
}
