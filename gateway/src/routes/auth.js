/**
 * Authentication routes for the gateway.
 * Proxies requests to Quarkus and manages session state.
 */
const express = require('express');
const quarkusClient = require('../services/quarkusClient');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /signup — Register a new user.
 * Proxies to Quarkus POST /users.
 */
router.post('/signup', async (req, res) => {
  try {
    const user = await quarkusClient.signup(req.body);
    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: 'Registration failed' };
    res.status(status).json(data);
  }
});

/**
 * POST /login — Authenticate a user and create a session.
 * Proxies to Quarkus POST /users/login, then stores user in session.
 */
router.post('/login', async (req, res) => {
  try {
    const user = await quarkusClient.login(req.body);
    
    // Store user info in session
    req.session.user = {
      id: user.id,
      email: user.email,
      verified: user.verified,
    };

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: 'Login failed' };
    res.status(status).json(data);
  }
});

/**
 * POST /logout — Destroy the session and clear the cookie.
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('oppex.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

/**
 * GET /profile — Get the current user's profile (protected).
 * Fetches fresh data from Quarkus to ensure verification status is current.
 */
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await quarkusClient.getUser(req.session.user.id);
    
    // Update session with latest data
    req.session.user = {
      id: user.id,
      email: user.email,
      verified: user.verified,
    };

    res.status(200).json({ user });
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: 'Failed to fetch profile' };
    res.status(status).json(data);
  }
});

/**
 * GET /verify — Verify email with token (proxies to Quarkus).
 */
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    const result = await quarkusClient.verifyEmail(token);
    res.status(200).json(result);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: 'Verification failed' };
    res.status(status).json(data);
  }
});

module.exports = router;
