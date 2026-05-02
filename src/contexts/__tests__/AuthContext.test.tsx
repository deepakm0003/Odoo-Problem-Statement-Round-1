import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthProvider, useAuth } from '../AuthContext';

/**
 * Helper component that exposes the auth state and actions for testing.
 */
const TestComponent: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="user">
        {user ? `${user.name} (${user.email})` : 'no-user'}
      </div>
      <button
        onClick={() => login('testuser', 'password')}
        data-testid="login-button"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };

  beforeEach(() => {
    // Reset fetch mock before each test
    (global as any).fetch = jest.fn();
  });

  it('should have no user initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('login should set the user on successful response', async () => {
    // Mock successful login response
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-button'));
    });

    expect(fetch).toHaveBeenCalledWith('/api/login', expect.objectContaining({
      method: 'POST',
      credentials: 'include',
    }));
    expect(screen.getByTestId('user')).toHaveTextContent('Test User (test@example.com)');
  });

  it('login should throw an error when response is not ok', async () => {
    (global as any).fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Invalid credentials',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expect(
        (async () => {
          fireEvent.click(screen.getByTestId('login-button'));
        })()
      ).rejects.toThrow('Invalid credentials');
    });
  });

  it('logout should clear the user', async () => {
    // Mock login first
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Perform login
    await act(async () => {
      fireEvent.click(screen.getByTestId('login-button'));
    });
    expect(screen.getByTestId('user')).toHaveTextContent('Test User (test@example.com)');

    // Mock logout response
    (global as any).fetch.mockResolvedValueOnce({ ok: true });

    await act(async () => {
      fireEvent.click(screen.getByTestId('logout-button'));
    });

    expect(fetch).toHaveBeenCalledWith('/api/logout', expect.objectContaining({
      method: 'POST',
      credentials: 'include',
    }));
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });
});
