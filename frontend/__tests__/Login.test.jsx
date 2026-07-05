import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Login from '../src/pages/Login';
import { AuthProvider } from '../src/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import client from '../src/api/client';

// Mock the API client
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

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderLogin() {
  // Mock the initial session check to return no user
  client.get.mockRejectedValue({ response: { status: 401 } });

  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    </GoogleOAuthProvider>
  );
}

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    client.get.mockRejectedValue({ response: { status: 401 } });
  });

  it('renders login form with email and password fields', async () => {
    renderLogin();

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error message on login failure', async () => {
    renderLogin();

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    client.post.mockRejectedValue({
      response: { data: { error: 'Invalid email or password' } },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@oppex.dev' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('navigates to dashboard on successful login', async () => {
    renderLogin();

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    client.post.mockResolvedValue({
      data: { user: { id: '1', email: 'test@oppex.dev', verified: true } },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@oppex.dev' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('has a link to signup page', async () => {
    renderLogin();

    await waitFor(() => {
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });
  });
});
