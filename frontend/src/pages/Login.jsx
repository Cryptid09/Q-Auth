import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

/**
 * Login page — Bauhaus Edition.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const isVerified = searchParams.get('verified') === 'true';
  const verificationError = searchParams.get('error');
  
  const successMessage = isVerified ? 'Email successfully verified! You can now log in.' : location.state?.message;
  const [displaySuccess, setDisplaySuccess] = useState(successMessage);

  useEffect(() => {
    setDisplaySuccess(successMessage);
    if (successMessage) {
      const timer = setTimeout(() => {
        setDisplaySuccess('');
        navigate('/login', { replace: true, state: {} });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

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

  async function handleGoogleSuccess(credentialResponse) {
    setLocalError('');
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setLocalError(err.message);
    }
  }

  const finalError = localError || (verificationError ? (verificationError === 'missing_token' ? 'Invalid verification link.' : 'Email verification failed.') : '');

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">
      <div className="fixed inset-0 grid-pattern pointer-events-none"></div>
      
      <header className="z-20 flex justify-between items-center px-6 py-6 w-full bg-transparent">
        <div className="font-display text-2xl font-bold uppercase tracking-tighter text-primary border-b-4 border-primary-fixed">Oppex Portal</div>
        <div className="flex gap-4 items-center">
          <button className="text-on-surface hover:text-secondary transition-colors">
            <span className="material-symbols-outlined text-3xl">help_outline</span>
          </button>
        </div>
      </header>
      
      <main className="flex-grow z-10 flex items-center justify-center px-6 py-12">
        <div className={`bauhaus-card w-full max-w-[440px] p-8 md:p-10 relative ${finalError ? 'animate-shake' : ''}`}>
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-secondary border-4 border-primary"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-tertiary rounded-full border-4 border-primary"></div>
          
          <div className="mb-10">
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-on-surface mb-2">Login</h1>
            <div className="h-1.5 w-16 bg-primary-fixed mb-4"></div>
            <p className="font-body text-on-surface-variant">Access the secure environment.</p>
          </div>

          {displaySuccess && !finalError && (
            <div className="mb-6 flex items-center gap-3 p-4 border-4 border-primary bg-green-50 text-green-800 font-bold" id="success-banner">
              <span className="material-symbols-outlined">check_circle</span>
              <span>{displaySuccess}</span>
            </div>
          )}

          {finalError && (
            <div className="mb-6 flex items-center gap-3 p-4 border-4 border-secondary bg-red-50 text-secondary font-bold" id="error-banner">
              <span className="material-symbols-outlined">error</span>
              <span>{finalError}</span>
            </div>
          )}

          <div className="mb-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setLocalError('Google Sign-In failed')}
              useOneTap
            />
          </div>
          
          <div className="flex items-center mb-6 before:flex-1 before:border-t-2 before:border-primary/10 after:flex-1 after:border-t-2 after:border-primary/10">
             <p className="text-center font-label text-xs uppercase tracking-widest text-on-surface-variant mx-4">Or Login With Email</p>
          </div>

          <form className="space-y-8" id="login-form" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-label text-xs font-bold text-on-surface uppercase tracking-widest block" htmlFor="email">User Email</label>
              <input 
                className="w-full bauhaus-input px-4 py-3 text-on-surface placeholder-outline-variant focus:outline-none" 
                id="email" 
                placeholder="NAME@COMPANY.COM" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label text-xs font-bold text-on-surface uppercase tracking-widest block" htmlFor="password">Password</label>
                <Link className="text-secondary text-xs font-bold uppercase hover:underline" to="/forgot-password">Reset</Link>
              </div>
              <div className="relative">
                <input 
                  className="w-full bauhaus-input px-4 py-3 pr-12 text-on-surface placeholder-outline-variant focus:outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            
            <button 
              className="w-full bg-primary-fixed bauhaus-button text-on-primary-container font-bold uppercase tracking-widest py-5 flex justify-center items-center gap-3" 
              id="submit-btn" 
              type="submit"
              disabled={submitting}
            >
              <span>{submitting ? 'Processing' : 'Authenticate'}</span>
              {submitting && <div className="spinner-bauhaus"></div>}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t-2 border-primary/10">
            <p className="font-body text-sm font-medium text-center">
              New user? 
              <Link className="text-secondary font-bold uppercase hover:underline ml-1" to="/signup">Create Account</Link>
            </p>
          </div>
        </div>
      </main>
      
      <footer className="z-20 flex flex-col md:flex-row justify-between items-center gap-6 px-10 py-10 w-full bg-primary text-on-primary">
        <div className="font-label text-xs font-bold uppercase tracking-widest">
            © 2024 Oppex Security Systems / Form Follows Function
        </div>
        <div className="flex gap-8">
          <a className="font-label text-xs font-bold uppercase hover:text-primary-fixed transition-colors" href="#">Privacy</a>
          <a className="font-label text-xs font-bold uppercase hover:text-primary-fixed transition-colors" href="#">Terms</a>
          <a className="font-label text-xs font-bold uppercase hover:text-primary-fixed transition-colors" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}
