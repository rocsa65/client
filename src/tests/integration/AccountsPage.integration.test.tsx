import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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

describe('AccountsPage Component Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component State Management Integration', () => {
    test('properly manages loading state during data fetch', async () => {
      // Mock delayed response to test loading state
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

      // Should initially show loading state
      expect(screen.getByText(/loading accounts/i)).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/loading accounts/i)).not.toBeInTheDocument();
      });

      // Should show empty state after loading
      expect(screen.getByText(/no accounts defined/i)).toBeInTheDocument();
    });

    test('transitions between loading, error, and success states', async () => {
      mockApiRequest.mockRejectedValue(new Error('Simulated error'));

      render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      // Should show loading initially
      expect(screen.getByText(/loading accounts/i)).toBeInTheDocument();

      // Should transition to error state
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
        expect(screen.queryByText(/loading accounts/i)).not.toBeInTheDocument();
      });
    });

    test('manages successful data loading state', async () => {
      const mockAccounts = [
        {
          id: 1,
          name: 'Test Account',
          identifier: 'test-001',
          currency: 1,
          balance: 1000.00
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

      // Should transition from loading to displaying data
      expect(screen.getByText(/loading accounts/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/loading accounts/i)).not.toBeInTheDocument();
        expect(screen.getByText('Test Account')).toBeInTheDocument();
      });
    });
  });

  describe('Data Processing and Display Integration', () => {
    test('correctly processes and displays account data', async () => {
      const mockAccounts = [
        {
          id: 1,
          name: 'Checking Account',
          identifier: 'check-001',
          currency: 1,
          balance: 1234.56
        },
        {
          id: 2,
          name: 'Savings Account',
          identifier: 'save-001',
          currency: 1,
          balance: 9876.54
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
        expect(screen.getByText('Checking Account')).toBeInTheDocument();
        expect(screen.getByText('Savings Account')).toBeInTheDocument();
      });

      // Verify balance formatting (raw numbers, not formatted with commas)
      expect(screen.getByText('1234.56')).toBeInTheDocument();
      expect(screen.getByText('9876.54')).toBeInTheDocument();
    });

    test('handles different currency types in display', async () => {
      const mockAccountsWithCurrencies = [
        {
          id: 1,
          name: 'USD Account',
          identifier: 'usd-001',
          currency: 1, // Assuming 1 = USD
          balance: 1000.00
        },
        {
          id: 2,
          name: 'EUR Account',
          identifier: 'eur-001',
          currency: 2, // Assuming 2 = EUR
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
      });

      // Both accounts should display their balances (raw numbers)
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('2000')).toBeInTheDocument();
    });

    test('handles empty account list correctly', async () => {
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

      // Should not show any account data in table
      expect(screen.queryByText('Checking Account')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling Integration', () => {
    test('displays error message when API call fails', async () => {
      mockApiRequest.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      // Should not show loading or account data
      expect(screen.queryByText(/loading accounts/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/no accounts defined/i)).not.toBeInTheDocument();
    });

    test('handles malformed API response gracefully', async () => {
      // Mock console.error to avoid test noise
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      mockApiRequest.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(null) // Invalid response
      });

      render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        // Component should handle gracefully - either show error or empty state
        const hasErrorOrEmpty = screen.queryByText(/error/i) || screen.queryByText(/no accounts defined/i);
        expect(hasErrorOrEmpty).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    test('handles API response with invalid status', async () => {
      mockApiRequest.mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' })
      });

      render(
        <TestWrapper>
          <AccountsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Component Lifecycle Integration', () => {
    test('properly initializes and cleans up component', async () => {
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
      expect(screen.getByText(/loading accounts/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText(/no accounts defined/i)).toBeInTheDocument();
      });

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });

    test('handles component re-render correctly', async () => {
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

    test('triggers API call on component mount', async () => {
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

      // Should call the API immediately on mount
      expect(mockApiRequest).toHaveBeenCalledWith('/api/Account');
      expect(mockApiRequest).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(screen.getByText(/no accounts/i)).toBeInTheDocument();
      });
    });
  });

  describe('Component Integration with React Router', () => {
    test('integrates properly with BrowserRouter', async () => {
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

      // Component should render without router-related errors
      await waitFor(() => {
        expect(screen.getByText(/no accounts defined/i)).toBeInTheDocument();
      });

      // Should maintain consistent behavior within router context
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    test('maintains state during route context changes', async () => {
      const mockAccounts = [
        { id: 1, name: 'Test Account', identifier: 'test-001', currency: 1, balance: 1000 }
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
        expect(screen.getByText('Test Account')).toBeInTheDocument();
      });

      // Data should persist and be stable
      expect(screen.getByText('Test Account')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });
  });
});