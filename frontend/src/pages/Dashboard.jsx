import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Dashboard page — protected, shows verification status.
 * Bauhaus Edition.
 */
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">
      <div className="fixed inset-0 grid-pattern pointer-events-none"></div>
      
      <header className="z-20 flex justify-between items-center px-6 py-6 w-full bg-transparent">
        <div className="font-display text-2xl font-bold uppercase tracking-tighter text-primary border-b-4 border-primary-fixed">Oppex Portal</div>
        <div className="flex gap-4 items-center relative">
          <button 
            className="text-on-surface hover:text-secondary transition-colors"
            onClick={() => setShowHelp(!showHelp)}
            title="Help"
          >
            <span className="material-symbols-outlined text-3xl">help_outline</span>
          </button>
          
          {showHelp && (
            <div className="absolute top-12 right-0 w-72 bg-primary text-on-primary border-4 border-secondary p-5 shadow-[8px_8px_0_0_rgba(0,0,0,1)] z-50">
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-tertiary border-2 border-primary rounded-full"></div>
              <h4 className="font-display font-bold uppercase tracking-tight text-xl mb-2">Dashboard Info</h4>
              <p className="font-body text-sm mb-4">This is your secure control panel. Make sure your email is verified to gain full access to the portal features.</p>
              <div className="flex justify-end">
                <button 
                  className="bg-secondary text-primary font-bold px-4 py-1.5 border-2 border-primary hover:bg-white transition-colors"
                  onClick={() => setShowHelp(false)}
                >
                  DISMISS
                </button>
              </div>
            </div>
          )}
          
          <button 
            onClick={logout}
            className="font-display font-bold uppercase bg-transparent text-primary border-4 border-primary px-4 py-1.5 hover:bg-primary hover:text-white transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1"
          >
            Log Out
          </button>
        </div>
      </header>
      
      <main className="flex-grow z-10 flex items-center justify-center px-6 py-12">
        <div className="bauhaus-card w-full max-w-[600px] p-8 md:p-10 relative">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-secondary border-4 border-primary"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-tertiary rounded-full border-4 border-primary"></div>
          
          <div className="mb-10">
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-on-surface mb-2">Dashboard</h1>
            <div className="h-1.5 w-16 bg-primary-fixed mb-4"></div>
            <p className="font-body text-on-surface-variant font-bold text-lg">Welcome, {user?.email}</p>
          </div>

          <div className="mb-8 p-6 border-4 border-primary bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight mb-4 text-gray-700">Account Status</h2>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label font-bold uppercase text-gray-700">Verification:</span>
              <div className={`px-3 py-1 border-2 font-bold uppercase text-xs tracking-wider ${user?.verified ? 'bg-[#c8e6c9] border-[#2e7d32] text-[#1b5e20]' : 'bg-[#ffcdd2] border-[#c62828] text-[#b71c1c]'}`}>
                {user?.verified ? 'Verified' : 'Unverified'}
              </div>
            </div>

            {user?.verified ? (
              <div className="flex gap-4 p-4 border-4 border-primary bg-[#e8f5e9]" id="verified-message">
                <span className="material-symbols-outlined text-[#2e7d32] text-3xl">verified_user</span>
                <div>
                  <h3 className="font-display font-bold uppercase text-[#2e7d32]">Access Granted</h3>
                  <p className="font-body text-[#1b5e20] font-medium">Your email is validated. You can access the portal.</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 p-4 border-4 border-primary bg-[#ffebee]" id="unverified-message">
                <span className="material-symbols-outlined text-[#c62828] text-3xl">gpp_maybe</span>
                <div>
                  <h3 className="font-display font-bold uppercase text-[#c62828]">Action Required</h3>
                  <p className="font-body text-[#b71c1c] font-medium">You need to validate your email to access the portal.</p>
                </div>
              </div>
            )}
            
            {user?.authProvider === 'GOOGLE' && (
              <div className="mt-4 flex gap-4 p-4 border-4 border-primary bg-blue-50">
                <span className="material-symbols-outlined text-blue-700 text-3xl">account_circle</span>
                <div>
                  <h3 className="font-display font-bold uppercase text-blue-800">Google Account</h3>
                  <p className="font-body text-blue-900 font-medium">This account is securely linked to your Google identity.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="z-20 flex justify-end items-center px-10 py-10 w-full bg-primary text-on-primary mt-auto">
        <div className="font-label text-xs font-bold uppercase tracking-widest">
            OppexAi
        </div>
      </footer>
    </div>
  );
}
