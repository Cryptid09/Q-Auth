package com.example.users.resource;

import com.example.users.dto.ForgotPasswordRequest;
import com.example.users.dto.ResetPasswordRequest;
import com.example.users.dto.LoginRequest;
import com.example.users.dto.GoogleAuthRequest;
import com.example.users.dto.MessageResponse;
import com.example.users.dto.SignupRequest;
import com.example.users.dto.UserResponse;
import com.example.users.service.UserService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestResponse;
import io.smallrye.common.annotation.Blocking;

import java.net.URI;
import java.util.UUID;

/**
 * REST resource for user operations.
 * Handles HTTP concerns only — all business logic is in UserService.
 */
@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Blocking
public class UserResource {

    private final UserService userService;

    @Inject
    public UserResource(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /users — Register a new user.
     *
     * @param request the signup request payload
     * @return 201 Created with the user response
     */
    @POST
    public RestResponse<UserResponse> register(@Valid SignupRequest request) {
        UserResponse response = userService.register(request);
        return RestResponse.created(URI.create("/users/" + response.id()));
    }

    /**
     * POST /users/login — Validate user credentials.
     *
     * @param request the login request payload
     * @return 200 OK with the user response
     */
    @POST
    @Path("/login")
    public RestResponse<UserResponse> login(@Valid LoginRequest request) {
        UserResponse response = userService.login(request);
        return RestResponse.ok(response);
    }

    /**
     * POST /users/google — Login or Register with Google.
     *
     * @param request the google auth request
     * @return 200 OK with the user response
     */
    @POST
    @Path("/google")
    public RestResponse<UserResponse> googleLogin(@Valid GoogleAuthRequest request) {
        UserResponse response = userService.loginWithGoogle(request.token());
        return RestResponse.ok(response);
    }

    /**
     * GET /users/verify?token={token} — Verify email using token.
     *
     * @param token the verification token from the email link
     * @return 200 OK with a success message
     */
    @GET
    @Path("/verify")
    public RestResponse<MessageResponse> verifyEmail(@QueryParam("token") String token) {
        userService.verifyEmail(token);
        return RestResponse.ok(new MessageResponse("Email verified successfully"));
    }

    /**
     * POST /users/{id}/resend-verification — Resend verification email.
     *
     * @param id the user UUID
     * @return 200 OK with a success message
     */
    @POST
    @Path("/{id}/resend-verification")
    public RestResponse<MessageResponse> resendVerification(@PathParam("id") UUID id) {
        userService.resendVerification(id);
        return RestResponse.ok(new MessageResponse("Verification email resent"));
    }

    /**
     * GET /users/{id} — Get user information by ID.
     *
     * @param id the user UUID
     * @return 200 OK with the user response
     */
    @GET
    @Path("/{id}")
    public RestResponse<UserResponse> getUser(@PathParam("id") UUID id) {
        UserResponse response = userService.getUserById(id);
        return RestResponse.ok(response);
    }

    /**
     * POST /users/forgot-password — Request a password reset.
     *
     * @param request the forgot password request payload
     * @return 200 OK with a success message
     */
    @POST
    @Path("/forgot-password")
    public RestResponse<MessageResponse> forgotPassword(@Valid ForgotPasswordRequest request) {
        userService.generatePasswordResetToken(request.email());
        return RestResponse.ok(new MessageResponse("Password reset email sent"));
    }

    /**
     * POST /users/reset-password — Reset password using a token.
     *
     * @param request the reset password request payload
     * @return 200 OK with a success message
     */
    @POST
    @Path("/reset-password")
    public RestResponse<MessageResponse> resetPassword(@Valid ResetPasswordRequest request) {
        userService.resetPassword(request.token(), request.newPassword());
        return RestResponse.ok(new MessageResponse("Password successfully reset"));
    }
}
