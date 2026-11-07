import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthGate } from './AuthGate';

const mockGetSupabaseClient = vi.fn();
const mockSetStoredAuthUser = vi.fn();

vi.mock('../lib/supabase', () => ({
  getSupabaseClient: () => mockGetSupabaseClient(),
  setStoredAuthUser: (user: any) => mockSetStoredAuthUser(user),
}));

describe('AuthGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in form without any demo credentials or autofill button', () => {
    mockGetSupabaseClient.mockReturnValue(null);
    render(<AuthGate onAuthenticated={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /gradquest/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /autofill/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/gradsearch2027/i)).not.toBeInTheDocument();
  });

  it('shows error if submitted with empty fields', async () => {
    mockGetSupabaseClient.mockReturnValue(null);
    render(<AuthGate onAuthenticated={vi.fn()} />);

    // HTML5 required handles native validation, but form submission triggers handleSubmit
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form')!;
    fireEvent.submit(form);

    expect(await screen.findByText('Please enter your email and password.')).toBeInTheDocument();
  });

  it('fails if Supabase client is not configured (no backdoor fallback)', async () => {
    mockGetSupabaseClient.mockReturnValue(null);
    render(<AuthGate onAuthenticated={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText(
        'Supabase is not configured. Please check your environment configuration.'
      )
    ).toBeInTheDocument();
    expect(mockSetStoredAuthUser).not.toHaveBeenCalled();
  });

  it('handles Supabase authentication failure', async () => {
    const mockSignInWithPassword = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });
    mockGetSupabaseClient.mockReturnValue({
      auth: { signInWithPassword: mockSignInWithPassword },
    });

    render(<AuthGate onAuthenticated={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Invalid login credentials')).toBeInTheDocument();
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'wrongpass',
    });
    expect(mockSetStoredAuthUser).not.toHaveBeenCalled();
  });

  it('successfully signs in via Supabase and calls onAuthenticated', async () => {
    const onAuthenticated = vi.fn();
    const mockSignInWithPassword = vi.fn().mockResolvedValue({
      data: {
        user: { id: 'user-uuid-123', email: 'verified@example.com' },
      },
      error: null,
    });
    mockGetSupabaseClient.mockReturnValue({
      auth: { signInWithPassword: mockSignInWithPassword },
    });

    render(<AuthGate onAuthenticated={onAuthenticated} />);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'verified@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: { value: 'correctpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSetStoredAuthUser).toHaveBeenCalledWith({
        id: 'user-uuid-123',
        email: 'verified@example.com',
      });
      expect(onAuthenticated).toHaveBeenCalled();
    });
  });
});

