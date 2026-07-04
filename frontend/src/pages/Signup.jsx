import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Signup page — registration form with success message.
 */
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);

    try {
      await signup(email, password);
      setSuccess(true);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="card-header">
            <h1>Check Your Email</h1>
            <p>We've sent a verification link to <strong>{email}</strong></p>
          </div>

          <div className="alert alert-success" id="signup-success">
            Registration successful! Please verify your email before logging in.
          </div>

          <div className="card-footer">
            <span>Already verified?</span>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h1>Create Account</h1>
          <p>Join Oppex Portal today</p>
        </div>

        {localError && (
          <div className="alert alert-error" role="alert" id="signup-error">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} id="signup-form">
          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">Email</label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-password" className="form-label">Password</label>
            <input
              id="signup-password"
              type="password"
              className="form-input"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            id="signup-submit"
          >
            {submitting ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <div className="card-footer">
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
