/**
 * Gateway configuration.
 * All settings are driven by environment variables with sensible defaults.
 */
require('dotenv').config();

module.exports = {
  port: parseInt(process.env.GATEWAY_PORT || '3001', 10),
  
  quarkusBaseUrl: process.env.QUARKUS_BASE_URL || 'http://localhost:8080',
  
  session: {
    secret: process.env.SESSION_SECRET || 'oppex-dev-secret-change-in-production',
    name: 'oppex.sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
};
