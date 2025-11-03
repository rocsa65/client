import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountsPage from './AccountsPage';

// Mock fetch globally
global.fetch = jest.fn();

describe('AccountsPage', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    (fetch as jest.MockedFunction<typeof fetch>).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    // Mock a pending fetch
    (fetch as jest.MockedFunction<typeof fetch>).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading state
    );

    render(<AccountsPage />);
    
    expect(screen.getByText('Loading accounts...')).toBeInTheDocument();
  });

  test('displays error message when fetch fails', async () => {
    // Mock fetch to reject
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
      new Error('Network error')
    );

    render(<AccountsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
      expect(screen.getByText(/Backend might not be running/)).toBeInTheDocument();
    });
  });

  test('displays "Show Mock Data Instead" button when fetch fails', async () => {
    // Mock fetch to reject
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
      new Error('Failed to fetch')
    );

    render(<AccountsPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Show Mock Data Instead/i })).toBeInTheDocument();
    });
  });

  test('shows mock data when "Show Mock Data Instead" button is clicked', async () => {
    // Mock fetch to reject
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
      new Error('Failed to fetch')
    );

    render(<AccountsPage />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Show Mock Data Instead/i })).toBeInTheDocument();
    });

    // Click the mock data button
    fireEvent.click(screen.getByRole('button', { name: /Show Mock Data Instead/i }));

    // Check if mock data is displayed
    await waitFor(() => {
      expect(screen.getByText('Accounts')).toBeInTheDocument();
      expect(screen.getByText('(Mock Data)')).toBeInTheDocument();
      expect(screen.getByText('Checking Account')).toBeInTheDocument();
      expect(screen.getByText('Savings Account')).toBeInTheDocument();
      expect(screen.getByText('Business Account')).toBeInTheDocument();
      expect(screen.getByText('2500.5')).toBeInTheDocument();
      expect(screen.getByText('15000')).toBeInTheDocument();
      expect(screen.getByText('8750.25')).toBeInTheDocument();
    });
  });

  test('displays accounts data when fetch is successful', async () => {
    const mockAccountsData = [
      { id: 1, name: 'Test Account 1', currency: 'USD', balance: 1000.50 },
      { id: 2, name: 'Test Account 2', currency: 'EUR', balance: 2500.75 }
    ];

    // Mock successful fetch
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockAccountsData),
    } as Response);

    render(<AccountsPage />);

    await waitFor(() => {
      expect(screen.getByText('Accounts')).toBeInTheDocument();
      expect(screen.getByText('Test Account 1')).toBeInTheDocument();
      expect(screen.getByText('Test Account 2')).toBeInTheDocument();
      expect(screen.getByText('1000.5')).toBeInTheDocument();
      expect(screen.getByText('2500.75')).toBeInTheDocument();
      expect(screen.getByText('USD')).toBeInTheDocument();
      expect(screen.getByText('EUR')).toBeInTheDocument();
    });
  });

  test('displays "No accounts found" when API returns empty array', async () => {
    // Mock successful fetch with empty data
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    } as Response);

    render(<AccountsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No accounts found!/)).toBeInTheDocument();
      expect(screen.getByText(/Backend returned empty data/)).toBeInTheDocument();
    });
  });

  test('handles HTTP error responses correctly', async () => {
    // Mock fetch with HTTP error
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    } as Response);

    render(<AccountsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Error: HTTP error! status: 404/)).toBeInTheDocument();
    });
  });

  test('renders table headers correctly when data is present', async () => {
    const mockAccountsData = [
      { id: 1, name: 'Test Account', currency: 'USD', balance: 1000 }
    ];

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockAccountsData),
    } as Response);

    render(<AccountsPage />);

    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Currency/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Balance/i })).toBeInTheDocument();
    });
  });

  test('calls fetch with correct URL', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    } as Response);

    render(<AccountsPage />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/Account');
    });
  });

  test('logs correct messages to console', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    } as Response);

    render(<AccountsPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('AccountsPage: Starting to fetch accounts...');
      expect(consoleSpy).toHaveBeenCalledWith('AccountsPage: Response received', 200);
      expect(consoleSpy).toHaveBeenCalledWith('AccountsPage: Data received', []);
    });

    consoleSpy.mockRestore();
  });
});
