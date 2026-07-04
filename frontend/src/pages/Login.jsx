import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login page — email/password form with error handling.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your portal</p>
        </div>

        {localError && (
          <div className="alert alert-error" role="alert" id="login-error">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            id="login-submit"
          >
            {submitting ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className="card-footer">
          <span>Don't have an account?</span>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
