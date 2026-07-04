package com.example.users.service;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.reactive.ReactiveMailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

/**
 * Service responsible for sending emails.
 * Uses the Quarkus ReactiveMailer to send emails asynchronously.
 */
@ApplicationScoped
public class EmailService {

    private static final Logger LOG = Logger.getLogger(EmailService.class);

    private final ReactiveMailer reactiveMailer;

    @Inject
    public EmailService(ReactiveMailer reactiveMailer) {
        this.reactiveMailer = reactiveMailer;
    }

    /**
     * Sends a verification email to the newly registered user asynchronously.
     *
     * @param toEmail the recipient email address
     * @param verificationUrl the full verification URL with token
     */
    public void sendVerificationEmail(String toEmail, String verificationUrl) {
        LOG.infof("Sending verification email to %s", toEmail);

        String subject = "Verify your email — Oppex Portal";
        String htmlBody = buildVerificationHtml(verificationUrl);

        reactiveMailer.send(
                Mail.withHtml(toEmail, subject, htmlBody)
                    .setTo(java.util.List.of(toEmail))
        ).subscribe().with(
                success -> LOG.infof("Verification email sent to %s", toEmail),
                failure -> LOG.errorf(failure, "Failed to send verification email to %s", toEmail)
        );
    }

    /**
     * Sends a password reset email to the user asynchronously.
     *
     * @param toEmail the recipient email address
     * @param resetUrl the full reset URL with token
     */
    public void sendPasswordResetEmail(String toEmail, String resetUrl) {
        LOG.infof("Sending password reset email to %s", toEmail);

        String subject = "Reset your password — Oppex Portal";
        String htmlBody = buildPasswordResetHtml(resetUrl);

        reactiveMailer.send(
                Mail.withHtml(toEmail, subject, htmlBody)
                    .setTo(java.util.List.of(toEmail))
        ).subscribe().with(
                success -> LOG.infof("Password reset email sent to %s", toEmail),
                failure -> LOG.errorf(failure, "Failed to send password reset email to %s", toEmail)
        );
    }

    private String buildVerificationHtml(String verificationUrl) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f23; color: #e0e0e0; padding: 40px; }
                        .container { max-width: 520px; margin: 0 auto; background: #1a1a3e; border-radius: 12px; padding: 40px; border: 1px solid #2a2a5a; }
                        h1 { color: #7c83ff; font-size: 24px; margin-bottom: 16px; }
                        p { line-height: 1.6; color: #b0b0d0; }
                        .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea, #764ba2); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
                        .footer { margin-top: 32px; font-size: 12px; color: #666690; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Welcome to Oppex Portal</h1>
                        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
                        <a href="%s" class="btn">Verify Email</a>
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #667eea;">%s</p>
                        <div class="footer">
                            <p>If you did not create an account, you can safely ignore this email.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(verificationUrl, verificationUrl);
    }

    private String buildPasswordResetHtml(String resetUrl) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f23; color: #e0e0e0; padding: 40px; }
                        .container { max-width: 520px; margin: 0 auto; background: #1a1a3e; border-radius: 12px; padding: 40px; border: 1px solid #2a2a5a; }
                        h1 { color: #7c83ff; font-size: 24px; margin-bottom: 16px; }
                        p { line-height: 1.6; color: #b0b0d0; }
                        .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea, #764ba2); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
                        .footer { margin-top: 32px; font-size: 12px; color: #666690; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Password Reset Request</h1>
                        <p>We received a request to reset your password. Click the button below to choose a new one:</p>
                        <a href="%s" class="btn">Reset Password</a>
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #667eea;">%s</p>
                        <div class="footer">
                            <p>If you did not request a password reset, you can safely ignore this email.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(resetUrl, resetUrl);
    }
}
