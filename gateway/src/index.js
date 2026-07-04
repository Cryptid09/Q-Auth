/**
 * Express application factory and server entry point.
 * Exports createApp() for testing and starts the server when run directly.
 */
const express = require('express');
const cors = require('cors');
const config = require('./config');
const sessionMiddleware = require('./middleware/session');
const authRoutes = require('./routes/auth');

/**
 * Creates and configures the Express application.
 * Exported for test usage via Supertest.
 */
function createApp() {
  const app = express();

  // Middleware
  app.use(cors(config.cors));
  app.use(express.json());
  app.use(sessionMiddleware);

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'oppex-gateway' });
  });

  // Routes
  app.use('/', authRoutes);

  return app;
}

// Start server only when run directly (not imported for tests)
if (require.main === module) {
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`Oppex Gateway running on port ${config.port}`);
    console.log(`Quarkus backend: ${config.quarkusBaseUrl}`);
  });
}

module.exports = { createApp };
