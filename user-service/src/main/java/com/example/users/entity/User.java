package com.example.users.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Represents a registered user in the authentication system.
 * Uses UUID as the primary key for security and distributed safety.
 */
@Entity
@Table(name = "users")
public class User extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    public UUID id;

    @Column(name = "email", unique = true, nullable = false, length = 255)
    public String email;

    @Column(name = "password_hash", length = 255)
    public String passwordHash;

    @Column(name = "verified", nullable = false)
    public boolean verified = false;

    @Column(name = "verification_token", length = 255)
    public String verificationToken;

    @Column(name = "reset_token", length = 255)
    public String resetToken;

    @Column(name = "reset_token_expiry")
    public Instant resetTokenExpiry;

    @Column(name = "auth_provider", nullable = false, columnDefinition = "varchar(255) default 'LOCAL'")
    public String authProvider = "LOCAL";

    @Column(name = "google_id", unique = true)
    public String googleId;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    public Instant updatedAt;

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
