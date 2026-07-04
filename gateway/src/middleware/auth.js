/**
 * Authentication middleware.
 * Protects routes by verifying an active session exists.
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

module.exports = { requireAuth };
