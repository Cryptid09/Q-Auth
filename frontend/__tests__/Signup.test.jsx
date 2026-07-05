import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Signup from '../src/pages/Signup';
import { AuthProvider } from '../src/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import client from '../src/api/client';

vi.mock('../src/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock Google OAuth
vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
  GoogleLogin: () => <button>Sign in with Google</button>,
}));

function renderSignup() {
  client.get.mockRejectedValue({ response: { status: 401 } });

  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    </GoogleOAuthProvider>
  );
}

describe('Signup Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    client.get.mockRejectedValue({ response: { status: 401 } });
  });

  it('renders signup form with email and password fields', async () => {
    renderSignup();

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows success message after registration', async () => {
    renderSignup();

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    client.post.mockResolvedValue({
      data: { user: { id: '1', email: 'new@oppex.dev', verified: false } },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'new@oppex.dev' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  it('shows error on duplicate email', async () => {
    renderSignup();

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    client.post.mockRejectedValue({
      response: { data: { error: 'Email already registered' } },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@oppex.dev' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/already registered/i)).toBeInTheDocument();
    });
  });
});
