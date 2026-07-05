package com.example.users.service;

import com.example.users.dto.LoginRequest;
import com.example.users.dto.SignupRequest;
import com.example.users.dto.UserResponse;
import com.example.users.entity.User;
import com.example.users.exception.DuplicateEmailException;
import com.example.users.exception.InvalidCredentialsException;
import com.example.users.exception.InvalidTokenException;
import com.example.users.repository.UserRepository;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService business logic.
 * Uses Mockito to isolate the service from external dependencies.
 */
@QuarkusTest
class UserServiceTest {

    @Inject
    UserService userService;

    @InjectMock
    UserRepository userRepository;

    @InjectMock
    PasswordService passwordService;

    @InjectMock
    EmailService emailService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.id = UUID.randomUUID();
        mockUser.email = "test@oppex.dev";
        mockUser.passwordHash = "$2a$10$hashedpassword";
        mockUser.verified = false;
        mockUser.verificationToken = "test-token-123";
        mockUser.createdAt = Instant.now();
        mockUser.updatedAt = Instant.now();
    }

    @Test
    void register_shouldHashPasswordAndPersist() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordService.hashPassword(anyString())).thenReturn("$2a$10$hashed");
        doNothing().when(userRepository).persist(any(User.class));
        doNothing().when(emailService).sendVerificationEmail(anyString(), anyString());

        SignupRequest request = new SignupRequest("new@oppex.dev", "password123");
        UserResponse response = userService.register(request);

        assertNotNull(response);
        assertEquals("new@oppex.dev", response.email());
        assertFalse(response.verified());

        verify(passwordService).hashPassword("password123");
        verify(userRepository).persist(any(User.class));
        verify(emailService).sendVerificationEmail(eq("new@oppex.dev"), anyString());
    }

    @Test
    void register_withDuplicateEmail_shouldThrow409() {
        when(userRepository.existsByEmail("existing@oppex.dev")).thenReturn(true);

        SignupRequest request = new SignupRequest("existing@oppex.dev", "password123");

        DuplicateEmailException ex = assertThrows(
                DuplicateEmailException.class,
                () -> userService.register(request)
        );
        assertEquals(409, ex.getStatusCode());
        verify(userRepository, never()).persist(any(User.class));
    }

    @Test
    void login_withValidCredentials_shouldReturnUser() {
        when(userRepository.findByEmail("test@oppex.dev")).thenReturn(Optional.of(mockUser));
        when(passwordService.verifyPassword("password123", mockUser.passwordHash)).thenReturn(true);

        LoginRequest request = new LoginRequest("test@oppex.dev", "password123");
        UserResponse response = userService.login(request);

        assertNotNull(response);
        assertEquals("test@oppex.dev", response.email());
        assertEquals(mockUser.id, response.id());
    }

    @Test
    void login_withWrongPassword_shouldThrow401() {
        when(userRepository.findByEmail("test@oppex.dev")).thenReturn(Optional.of(mockUser));
        when(passwordService.verifyPassword("wrongpass", mockUser.passwordHash)).thenReturn(false);

        LoginRequest request = new LoginRequest("test@oppex.dev", "wrongpass");

        assertThrows(InvalidCredentialsException.class, () -> userService.login(request));
    }

    @Test
    void login_withNonExistentEmail_shouldThrow401() {
        when(userRepository.findByEmail("nobody@oppex.dev")).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest("nobody@oppex.dev", "password123");

        assertThrows(InvalidCredentialsException.class, () -> userService.login(request));
    }

    @Test
    void verifyEmail_withValidToken_shouldMarkVerified() {
        when(userRepository.findByVerificationToken("valid-token")).thenReturn(Optional.of(mockUser));
        doNothing().when(userRepository).persist(any(User.class));

        UserResponse response = userService.verifyEmail("valid-token");

        assertTrue(response.verified());
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).persist(captor.capture());
        assertTrue(captor.getValue().verified);
        assertNull(captor.getValue().verificationToken);
    }

    @Test
    void verifyEmail_withInvalidToken_shouldThrow400() {
        when(userRepository.findByVerificationToken("bad-token")).thenReturn(Optional.empty());

        assertThrows(InvalidTokenException.class, () -> userService.verifyEmail("bad-token"));
    }

    @Test
    void loginWithGoogle_withValidTokenAndNewUser_shouldCreateUser() {
        // {"email":"google@oppex.dev","sub":"google123"} base64url encoded
        String token = "header.eyJlbWFpbCI6Imdvb2dsZUBvcHBleC5kZXYiLCJzdWIiOiJnb29nbGUxMjMifQ.signature";
        
        when(userRepository.findByGoogleId("google123")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("google@oppex.dev")).thenReturn(Optional.empty());
        doNothing().when(userRepository).persist(any(User.class));

        UserResponse response = userService.loginWithGoogle(token);

        assertNotNull(response);
        assertEquals("google@oppex.dev", response.email());
        assertTrue(response.verified());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).persist(captor.capture());
        assertEquals("google123", captor.getValue().googleId);
        assertEquals("GOOGLE", captor.getValue().authProvider);
    }

    @Test
    void loginWithGoogle_withInvalidToken_shouldThrow401() {
        String token = "invalid.token"; // Only 2 parts, should fail

        assertThrows(InvalidCredentialsException.class, () -> userService.loginWithGoogle(token));
    }
}
