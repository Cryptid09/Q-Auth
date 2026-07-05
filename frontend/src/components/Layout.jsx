import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Shared layout with navigation bar.
 * Shows different actions based on authentication state.
 */
export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password' || location.pathname === '/reset-password' || location.pathname === '/dashboard';

  return (
    <div className="app-layout">
      {!hideNav && (
        <nav className="nav">
          <Link to="/" className="nav-brand">Oppex Portal</Link>
          <div className="nav-actions">
            {user ? (
              <>
                <span className="nav-user">{user.email}</span>
                <button className="btn btn-ghost" onClick={logout} id="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" id="nav-login">Login</Link>
                <Link to="/signup" className="btn btn-ghost" id="nav-signup">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      )}
      <Outlet />
    </div>
  );
}
