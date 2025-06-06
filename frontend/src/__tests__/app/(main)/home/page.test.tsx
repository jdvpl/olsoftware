import HomePage from '@/app/(main)/home/page';
import { render } from '@testing-library/react';
import * as AuthContext from '@/contexts/AuthContext';

jest.mock('@/contexts/AuthContext');

describe('HomePage', () => {
  beforeEach(() => {
    (AuthContext.useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, name: 'Alice Admin', email: 'admin@example.com', role: 'ADMIN' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      token: 'mock_token', 
    });
  });

  it('renders the HomePage with mocked auth', () => {
    const { container } = render(<HomePage />);
    expect(container).toBeTruthy();
  });
});
