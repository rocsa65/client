import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the AccountsPage component since we're testing App in isolation
jest.mock('./pages/AccountsPage', () => {
  return function MockAccountsPage() {
    return <div data-testid="accounts-page">Mocked AccountsPage</div>;
  };
});

test('renders MyFinance header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /MyFinance/i });
  expect(headerElement).toBeInTheDocument();
});

test('renders AccountsPage component', () => {
  render(<App />);
  const accountsPageElement = screen.getByTestId('accounts-page');
  expect(accountsPageElement).toBeInTheDocument();
});
