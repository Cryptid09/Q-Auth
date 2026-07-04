/**
 * HTTP client for communicating with the Quarkus User Service.
 * All Quarkus API calls are centralized here.
 */
const axios = require('axios');
const config = require('../config');

const client = axios.create({
  baseURL: config.quarkusBaseUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const quarkusClient = {
  /**
   * Register a new user.
   * @param {{ email: string, password: string }} data
   */
  async signup(data) {
    const response = await client.post('/users', data);
    return response.data;
  },

  /**
   * Validate user credentials.
   * @param {{ email: string, password: string }} data
   */
  async login(data) {
    const response = await client.post('/users/login', data);
    return response.data;
  },

  /**
   * Verify email with token.
   * @param {string} token
   */
  async verifyEmail(token) {
    const response = await client.get('/users/verify', { params: { token } });
    return response.data;
  },

  /**
   * Get user by ID.
   * @param {string} id
   */
  async getUser(id) {
    const response = await client.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Request a password reset.
   * @param {string} email
   */
  async requestPasswordReset(email) {
    const response = await client.post('/users/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token.
   * @param {string} token
   * @param {string} newPassword
   */
  async resetPassword(token, newPassword) {
    const response = await client.post('/users/reset-password', { token, newPassword });
    return response.data;
  },
};

module.exports = quarkusClient;
