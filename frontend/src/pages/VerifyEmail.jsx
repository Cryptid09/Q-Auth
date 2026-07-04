import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import client from '../api/client';

/**
 * Email verification page.
 * Reads token from URL query params and calls the verify endpoint.
 */
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    verifyToken(token);
  }, [searchParams]);

  async function verifyToken(token) {
    try {
      await client.get('/verify', { params: { token } });
      setStatus('success');
      setMessage('Your email has been verified successfully!');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Verification failed. The token may be invalid or expired.');
    }
  }

  return (
    <div className="page-container">
      <div className="card">
        <div className="verify-container">
          <div className={`verify-icon ${status}`}>
            {status === 'loading' && '⟳'}
            {status === 'success' && '✓'}
            {status === 'error' && '✗'}
          </div>

          <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            {status === 'loading' && 'Verifying...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>

          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }} id="verify-message">
            {message}
          </p>

          {status !== 'loading' && (
            <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
              Go to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
