import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '@/app/page';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

jest.mock('@/contexts/AuthContext');
jest.mock('next/navigation');

jest.mock('axios', () => {
  const instance = {
    interceptors: {
      request: {
        use: jest.fn((config) => config),
      },
      response: {
        use: jest.fn(),
      },
    },
    create: jest.fn(() => instance),
    get: jest.fn(),
    post: jest.fn(),
  };
  return instance;
});

describe('HomePage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (axios.get as jest.Mock).mockResolvedValue({ data: {} });
  });

  it('muestra "Cargando..." cuando isLoading es true', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      login: jest.fn(),
    });

    render(<HomePage />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('redirige a /home cuando isAuthenticated es true y isLoading es false', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('redirige a /login cuando isAuthenticated es false y isLoading es false', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
