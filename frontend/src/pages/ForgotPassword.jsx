import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { requestPasswordReset } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');
    setMessage('');
    setSubmitting(true);

    try {
      await requestPasswordReset(email);
      setMessage('Password reset link sent to your email.');
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
      </header>
      
      <main className="flex-grow z-10 flex items-center justify-center px-6 py-12">
        <div className={`bauhaus-card w-full max-w-[440px] p-8 md:p-10 relative ${localError ? 'animate-shake' : ''}`}>
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-secondary border-4 border-primary"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-tertiary rounded-full border-4 border-primary"></div>
          
          <div className="mb-10">
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-on-surface mb-2">Reset</h1>
            <div className="h-1.5 w-16 bg-primary-fixed mb-4"></div>
            <p className="font-body text-on-surface-variant">Request a password reset link.</p>
          </div>

          {message && !localError && (
            <div className="mb-6 flex items-center gap-3 p-4 border-4 border-primary bg-green-50 text-green-800 font-bold">
              <span className="material-symbols-outlined">check_circle</span>
              <span>{message}</span>
            </div>
          )}

          {localError && (
            <div className="mb-6 flex items-center gap-3 p-4 border-4 border-secondary bg-red-50 text-secondary font-bold">
              <span className="material-symbols-outlined">error</span>
              <span>{localError}</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
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
            
            <button 
              className="w-full bg-primary-fixed bauhaus-button text-on-primary-container font-bold uppercase tracking-widest py-5 flex justify-center items-center gap-3" 
              type="submit"
              disabled={submitting}
            >
              <span>{submitting ? 'Processing' : 'Send Link'}</span>
              {submitting && <div className="spinner-bauhaus"></div>}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t-2 border-primary/10">
            <p className="font-body text-sm font-medium text-center">
              Remembered your password? 
              <Link className="text-secondary font-bold uppercase hover:underline ml-1" to="/login">Login</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
