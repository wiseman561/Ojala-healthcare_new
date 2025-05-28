import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

describe('ProtectedRoute Component', () => {
  it('renders children when user is authenticated', () => {
    // AuthContext mock returns isAuthenticated=true
    const { getByText } = render(
      <Router>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </Router>
    );
    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Override mock to return false
    jest.mocked(require('../contexts/AuthContext').useAuth).mockReturnValue({ isAuthenticated: false });
    const { queryByText } = render(
      <Router>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </Router>
    );
    expect(queryByText('Protected Content')).toBeNull();
  });
});
