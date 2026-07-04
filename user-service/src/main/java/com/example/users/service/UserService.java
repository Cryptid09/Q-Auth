package com.example.users.service;

import com.example.users.dto.LoginRequest;
import com.example.users.dto.SignupRequest;
import com.example.users.dto.UserResponse;
import com.example.users.entity.User;
import com.example.users.exception.DuplicateEmailException;
import com.example.users.exception.InvalidCredentialsException;
import com.example.users.exception.InvalidTokenException;
import com.example.users.mapper.UserMapper;
import com.example.users.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * Core business logic service for user operations.
 * Orchestrates registration, login, verification, and user retrieval.
 * All business rules are enforced here — the resource layer only handles HTTP concerns.
 */
@ApplicationScoped
public class UserService {

    private static final Logger LOG = Logger.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final VerificationService verificationService;
    private final EmailService emailService;

    @Inject
    public UserService(UserRepository userRepository,
                       PasswordService passwordService,
                       VerificationService verificationService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.verificationService = verificationService;
        this.emailService = emailService;
    }

    /**
     * Registers a new user.
     * Validates uniqueness, hashes the password, generates a verification token,
     * persists the user, and sends a verification email.
     *
     * @param request the signup request
     * @return the created user response
     * @throws DuplicateEmailException if the email is already registered
     */
    @Transactional
    public UserResponse register(SignupRequest request) {
        LOG.infof("Registration attempt for email: %s", request.email());

        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateEmailException(request.email());
        }

        String hashedPassword = passwordService.hashPassword(request.password());
        String verificationToken = verificationService.generateToken();

        User user = new User();
        user.email = request.email();
        user.passwordHash = hashedPassword;
        user.verified = false;
        user.verificationToken = verificationToken;

        userRepository.persist(user);
        LOG.infof("User created with id: %s", user.id);

        // Send verification email asynchronously-safe (Quarkus mailer handles threading)
        String verificationUrl = verificationService.buildVerificationUrl(verificationToken);
        emailService.sendVerificationEmail(user.email, verificationUrl);

        return UserMapper.toResponse(user);
    }

    /**
     * Validates user credentials for login.
     *
     * @param request the login request
     * @return the user response if credentials are valid
     * @throws InvalidCredentialsException if email or password is wrong
     */
    public UserResponse login(LoginRequest request) {
        LOG.infof("Login attempt for email: %s", request.email());

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordService.verifyPassword(request.password(), user.passwordHash)) {
            throw new InvalidCredentialsException();
        }

        LOG.infof("Login successful for user: %s", user.id);
        return UserMapper.toResponse(user);
    }

    /**
     * Verifies a user's email using the verification token.
     * Marks the user as verified and invalidates the token.
     *
     * @param token the verification token
     * @return the updated user response
     * @throws InvalidTokenException if the token is not found
     */
    @Transactional
    public UserResponse verifyEmail(String token) {
        LOG.infof("Email verification attempt with token: %s", token);

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(InvalidTokenException::new);

        user.verified = true;
        user.verificationToken = null; // Invalidate the token after use
        userRepository.persist(user);

        LOG.infof("Email verified for user: %s", user.id);
        return UserMapper.toResponse(user);
    }

    /**
     * Retrieves a user by their ID.
     *
     * @param id the user UUID
     * @return the user response
     * @throws jakarta.ws.rs.NotFoundException if the user does not exist
     */
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findByIdOptional(id)
                .orElseThrow(() -> new jakarta.ws.rs.NotFoundException("User not found"));
        return UserMapper.toResponse(user);
    }

    /**
     * Generates a password reset token for a user and triggers the reset email.
     *
     * @param email the user's email
     */
    @Transactional
    public void generatePasswordResetToken(String email) {
        LOG.infof("Password reset requested for email: %s", email);
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = verificationService.generateToken();
            user.resetToken = token;
            user.resetTokenExpiry = Instant.now().plus(1, ChronoUnit.HOURS);
            userRepository.persist(user);

            // Assuming baseUrl is something like http://localhost:3001/verify
            // We'll construct the reset URL pointing to the gateway's reset-password route
            String resetUrl = "http://localhost:3001/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.email, resetUrl);
        });
    }

    /**
     * Resets a user's password using a valid reset token.
     *
     * @param token the reset token
     * @param newPassword the new password to set
     * @throws InvalidTokenException if token is invalid or expired
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        LOG.infof("Attempting password reset with token: %s", token);
        User user = userRepository.findByResetToken(token)
                .orElseThrow(InvalidTokenException::new);

        if (user.resetTokenExpiry == null || user.resetTokenExpiry.isBefore(Instant.now())) {
            throw new InvalidTokenException();
        }

        user.passwordHash = passwordService.hashPassword(newPassword);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        userRepository.persist(user);

        LOG.infof("Password successfully reset for user: %s", user.id);
    }
}
