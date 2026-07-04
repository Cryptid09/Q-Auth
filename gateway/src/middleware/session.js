/**
 * Express session middleware configuration.
 * Uses in-memory store for development. For production, swap to Redis or similar.
 */
const session = require('express-session');
const config = require('../config');

const sessionMiddleware = session(config.session);

module.exports = sessionMiddleware;
