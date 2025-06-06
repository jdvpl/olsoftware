/* eslint-disable react/display-name */
import LoginPage from '@/app/(auth)/login/page';
import { render, screen } from '@testing-library/react';

jest.mock('@/components/auth/LoginHeader', () => () => <div data-testid="login-header" />);
jest.mock('@/components/auth/LoginForm', () => () => <div data-testid="login-form" />);

describe('LoginPage', () => {
  it('renders the LoginHeader and LoginForm components', () => {
    render(<LoginPage />);

    expect(screen.getByTestId('login-header')).toBeTruthy();
    expect(screen.getByTestId('login-form')).toBeTruthy();
  });
});
