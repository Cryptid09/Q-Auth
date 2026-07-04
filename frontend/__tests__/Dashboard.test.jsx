import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Dashboard from '../src/pages/Dashboard';
import { AuthProvider } from '../src/context/AuthContext';
import client from '../src/api/client';

vi.mock('../src/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

function renderDashboard(user) {
  // Mock the session check to return the provided user
  client.get.mockResolvedValue({ data: { user } });

  return render(
    <MemoryRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows unverified message when email is not verified', async () => {
    renderDashboard({ id: '1', email: 'test@oppex.dev', verified: false });

    await waitFor(() => {
      expect(
        screen.getByText('You need to validate your email to access the portal.')
      ).toBeInTheDocument();
    });
  });

  it('shows verified message when email is verified', async () => {
    renderDashboard({ id: '1', email: 'test@oppex.dev', verified: true });

    await waitFor(() => {
      expect(
        screen.getByText('Your email is validated. You can access the portal.')
      ).toBeInTheDocument();
    });
  });

  it('displays user email', async () => {
    renderDashboard({ id: '1', email: 'test@oppex.dev', verified: true });

    await waitFor(() => {
      expect(screen.getByText(/test@oppex.dev/)).toBeInTheDocument();
    });
  });
});
