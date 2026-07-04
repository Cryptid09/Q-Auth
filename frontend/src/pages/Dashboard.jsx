import { useAuth } from '../context/AuthContext';

/**
 * Dashboard page — protected, shows verification status.
 * Displays the exact messages required by the spec.
 */
export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="dashboard">
        <div className="dashboard-card">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p>Welcome, {user?.email}</p>
          </div>

          <div className={`status-badge ${user?.verified ? 'status-verified' : 'status-unverified'}`}>
            <span className="status-dot" />
            {user?.verified ? 'Email Verified' : 'Email Not Verified'}
          </div>

          {user?.verified ? (
            <div className="verification-message verified" id="verified-message">
              Your email is validated. You can access the portal.
            </div>
          ) : (
            <div className="verification-message unverified" id="unverified-message">
              You need to validate your email to access the portal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
