import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

jest.mock('@/services/api', () => ({
  defaults: {
    headers: {}
  }
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

const MockComponent = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  return (
    <div>
      <p>{isLoading ? 'Loading...' : 'Loaded'}</p>
      <p>{user ? `User: ${user.name}` : 'No user'}</p>
      <p>{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
      <button
        onClick={() =>
          login('mock_token', { id: 1, name: 'John', email: 'john@example.com', role: 'admin' })
        }
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const renderWithProvider = (ui: React.ReactElement) =>
  render(<AuthProvider>{ui}</AuthProvider>);

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders children and default auth state', async () => {
    renderWithProvider(<MockComponent />);


    await waitFor(() => {
      expect(screen.getByText('Loaded')).toBeInTheDocument();
      expect(screen.getByText('No user')).toBeInTheDocument();
      expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    });
  });

  it('logs in and updates context', async () => {
    renderWithProvider(<MockComponent />);

    await waitFor(() => screen.getByText('Loaded'));

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(screen.getByText('User: John')).toBeInTheDocument();
      expect(screen.getByText('Authenticated')).toBeInTheDocument();
    });

    expect(localStorage.getItem('token')).toBe('mock_token');
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual({
      id: 1,
      name: 'John',
      email: 'john@example.com',
      role: 'admin'
    });
  });

  it('logs out and clears context', async () => {
    localStorage.setItem('token', 'mock_token');
    localStorage.setItem(
      'user',
      JSON.stringify({ id: 1, name: 'John', email: 'john@example.com', role: 'admin' })
    );

    renderWithProvider(<MockComponent />);

    await waitFor(() => screen.getByText('User: John'));

    await act(async () => {
      await userEvent.click(screen.getByText('Logout'));
    });

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument();
      expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
