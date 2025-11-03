import React, { useEffect, useState } from 'react';

type Account = {
  id: number;
  name: string;
  currency: string;
  balance: number;
};

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Mock data for testing
  const mockAccounts: Account[] = [
    { id: 1, name: "Checking Account", currency: "USD", balance: 2500.50 },
    { id: 2, name: "Savings Account", currency: "USD", balance: 15000.00 },
    { id: 3, name: "Business Account", currency: "EUR", balance: 8750.25 }
  ];

  useEffect(() => {
    console.log('AccountsPage: Starting to fetch accounts...');
    fetch('/api/Account')
      .then(res => {
        console.log('AccountsPage: Response received', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('AccountsPage: Data received', data);
        setAccounts(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('AccountsPage: Error occurred', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{padding: '20px', fontSize: '18px'}}>Loading accounts...</div>;

  if (error && !useMockData) {
    return (
      <div style={{padding: '20px', fontSize: '18px'}}>
        <div style={{color: 'red', marginBottom: '20px'}}>
          Error: {error}. Backend might not be running.
        </div>
        <button 
          onClick={() => {
            setAccounts(mockAccounts);
            setUseMockData(true);
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Show Mock Data Instead
        </button>
      </div>
    );
  }

  if (accounts.length === 0 && !useMockData) return <div style={{padding: '20px', fontSize: '18px'}}>No accounts found! (Backend returned empty data)</div>;

  return (
    <div style={{padding: '20px'}}>
      <h2>Accounts {useMockData && <span style={{fontSize: '14px', color: '#666'}}>(Mock Data)</span>}</h2>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{backgroundColor: '#f5f5f5'}}>
            <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>Name</th>
            <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>Currency</th>
            <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'right'}}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td style={{border: '1px solid #ddd', padding: '12px'}}>{account.name}</td>
              <td style={{border: '1px solid #ddd', padding: '12px'}}>{account.currency}</td>
              <td style={{border: '1px solid #ddd', padding: '12px', textAlign: 'right'}}>{account.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsPage;