package com.example.users.config;

import io.smallrye.config.ConfigMapping;

/**
 * Type-safe configuration mapping for application-specific properties.
 */
@ConfigMapping(prefix = "app.verification")
public interface AppConfig {

    /**
     * The base URL for email verification links.
     * Example: http://localhost:3001/verify
     */
    @io.smallrye.config.WithName("base.url")
    String baseUrl();
}
