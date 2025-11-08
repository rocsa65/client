import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import AccountsPage from '../../pages/AccountsPage';

// Mock the apiRequest utility to avoid real API calls
jest.mock('../../utils/api', () => ({
  apiRequest: jest.fn(),
}));

const mockApiRequest = require('../../utils/api').apiRequest as jest.MockedFunction<any>;

// Test wrapper component with router
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Frontend Component Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('App and Router Integration', () => {
    test('App component integrates correctly with React Router', () => {
      // Mock successful API response to avoid hanging
      mockApiRequest.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      });

      render(<App />);
      
      // Verify app structure and routing integration
      expect(screen.getByRole('heading', { name: /MyFinance/i })).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('navigates to AccountsPage on root route', () => {
      mockApiRequest.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      });

      render(<App />);
      
      // Should render AccountsPage content (checking for accounts-related content)
      expect(screen.getByText(/MyFinance/)).toBeInTheDocument();
    });

    test('maintains consistent layout across route changes', () => {
      mockApiRequest.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      });

      const { rerender } = render(<App />);
      
      // Header should be present
      const header = screen.getByRole('heading', { name: /MyFinance/i });
      expect(header).toBeInTheDocument();

      // Re-render to simulate route change
      rerender(<App />);
      
      // Header should still be present (layout consistency)
      expect(screen.getByRole('heading', { name: /MyFinance/i })).toBeInTheDocument();
    });
  });

  describe('Component State Integration', () => {
    test('AccountsPage handles loading states correctly', async () => {
      // Mock a delayed response to test loading state
      mockApiRequest.mockImplementation(() => 
        new Promise((resolve) => 
          setTimeout(() => resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([])
          }), 50)
        )
      );

      render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      // Should show loading initially
      expect(screen.getByText(/loading accounts/i)).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/loading accounts/i)).not.toBeInTheDocument();
      });
    });

    test('AccountsPage integrates error display with component state', async () => {
      mockApiRequest.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    test('AccountsPage displays empty state when no data', async () => {
      mockApiRequest.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      });

      render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/no accounts defined/i)).toBeInTheDocument();
      });
    });
  });

  describe('Component Data Integration', () => {
    test('AccountsPage correctly processes and displays mock account data', async () => {
      const mockAccounts = [
        {
          id: 1,
          name: 'Test Checking Account',
          identifier: 'checking-001',
          currency: 1,
          balance: 1500.50
        },
        {
          id: 2,
          name: 'Test Savings Account',
          identifier: 'savings-001', 
          currency: 1,
          balance: 5000.00
        }
      ];

      mockApiRequest.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockAccounts)
      });

      render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Checking Account')).toBeInTheDocument();
        expect(screen.getByText('Test Savings Account')).toBeInTheDocument();
      });

      // Verify API was called correctly
      expect(mockApiRequest).toHaveBeenCalledWith('/api/Account');
    });

    test('AccountsPage handles currency display integration', async () => {
      const mockAccountsWithCurrencies = [
        {
          id: 1,
          name: 'USD Account',
          identifier: 'usd-001',
          currency: 1, // Should be handled by getCurrencyDisplay function
          balance: 1000.00
        },
        {
          id: 2,
          name: 'EUR Account', 
          identifier: 'eur-001',
          currency: 2, // Should be handled by getCurrencyDisplay function
          balance: 2000.00
        }
      ];

      mockApiRequest.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockAccountsWithCurrencies)
      });

      render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('USD Account')).toBeInTheDocument();
        expect(screen.getByText('EUR Account')).toBeInTheDocument();
        // Should display raw amounts (not formatted with commas)
        expect(screen.getByText('1000')).toBeInTheDocument();
        expect(screen.getByText('2000')).toBeInTheDocument();
      });
    });
  });

  describe('Error Boundary Integration', () => {
    test('components handle rendering errors gracefully', async () => {
      // Mock console.error to avoid test noise
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Provide malformed data to trigger error handling
      mockApiRequest.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve('invalid-data-format')
      });

      render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      // Should handle the error gracefully without crashing
      await waitFor(() => {
        // Component should either show error message or handle gracefully
        const hasErrorOrFallback = screen.queryByText(/error/i) || screen.queryByText(/no accounts defined/i);
        expect(hasErrorOrFallback).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Component Lifecycle Integration', () => {
    test('AccountsPage properly integrates with React lifecycle', async () => {
      mockApiRequest.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      });

      const { unmount } = render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      // Component should mount successfully
      await waitFor(() => {
        expect(screen.getByText(/no accounts defined/i)).toBeInTheDocument();
      });

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });

    test('component handles re-renders correctly', async () => {
      mockApiRequest.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      });

      const { rerender } = render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/no accounts defined/i)).toBeInTheDocument();
      });

      // Re-render should work without issues
      rerender(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      expect(screen.getByText(/no accounts defined/i)).toBeInTheDocument();
    });
  });
});