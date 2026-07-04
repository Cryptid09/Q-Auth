import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Signup page — Bauhaus Edition.
 */
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);

    try {
      await signup(email, password);
      navigate('/login', { state: { message: 'Registration successful! Please check your email to verify.' } });
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

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
        <div className={`bauhaus-card w-full max-w-[440px] p-8 md:p-10 relative ${localError ? 'animate-shake' : ''}`}>
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-secondary border-4 border-primary"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-tertiary rounded-full border-4 border-primary"></div>
          
          <div className="mb-10">
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-on-surface mb-2">Create Account</h1>
            <div className="h-1.5 w-16 bg-primary-fixed mb-4"></div>
            <p className="font-body text-on-surface-variant">Join Oppex Portal today.</p>
          </div>

          {localError && (
            <div className="mb-6 flex items-center gap-3 p-4 border-4 border-secondary bg-red-50 text-secondary font-bold" id="signup-error">
              <span className="material-symbols-outlined">error</span>
              <span>{localError}</span>
            </div>
          )}

          <form className="space-y-8" id="signup-form" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-label text-xs font-bold text-on-surface uppercase tracking-widest block" htmlFor="email">User Email</label>
              <input 
                className="w-full bauhaus-input px-4 py-3 text-on-surface placeholder-outline-variant focus:outline-none" 
                id="signup-email" 
                placeholder="NAME@COMPANY.COM" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-label text-xs font-bold text-on-surface uppercase tracking-widest block" htmlFor="password">Password</label>
              <div className="relative">
                <input 
                  className="w-full bauhaus-input px-4 py-3 pr-12 text-on-surface placeholder-outline-variant focus:outline-none" 
                  id="signup-password" 
                  placeholder="AT LEAST 8 CHARACTERS" 
                  required 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
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
              id="signup-submit" 
              type="submit"
              disabled={submitting}
            >
              <span>{submitting ? 'Processing' : 'Create Account'}</span>
              {submitting && <div className="spinner-bauhaus"></div>}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t-2 border-primary/10">
            <p className="font-body text-sm font-medium text-center">
              Already have an account? 
              <Link className="text-secondary font-bold uppercase hover:underline ml-1" to="/login">Sign In</Link>
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
