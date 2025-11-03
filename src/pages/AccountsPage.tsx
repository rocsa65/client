import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';

type Account = {
  id: number;
  name: string;
  identifier: string;
  currency: number; // Currency enum from API
  balance: number;
};

// API response might use PascalCase, so let's also define that
type ApiAccount = {
  Id: number;
  Name: string;
  Identifier: string;
  Currency: number;
  Balance: number;
};

// Helper function to convert currency enum to display string
const getCurrencyDisplay = (currency: number): string => {
  console.log('getCurrencyDisplay called with:', currency, typeof currency);
  const currencyNum = Number(currency);
  console.log('Converted to number:', currencyNum);
  
  switch (currencyNum) {
    case 0: return 'None';
    case 1: return 'USD';
    case 2: return 'EUR';
    case 3: return 'GBP';
    case 4: return 'RON';
    default: 
      console.log('Unknown currency value:', currency, typeof currency);
      return `Unknown (${currency})`;
  }
};

type CreateAccountFormProps = {
  onSubmit: (formData: {
    name: string;
    identifier: string;
    currency: string;
    balance: number;
  }) => void;
  onCancel: () => void;
  creating: boolean;
};

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ onSubmit, onCancel, creating }) => {
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    currency: '1', // USD
    balance: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      balance: Number(formData.balance)
    });
  };

  const currencyOptions = [
    { value: '1', label: 'USD' },
    { value: '2', label: 'EUR' },
    { value: '3', label: 'GBP' },
    { value: '4', label: 'RON' }
  ];

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      maxWidth: '500px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#495057' }}>Create New Account</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Account Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          placeholder="Enter account name"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Identifier (Optional)
        </label>
        <input
          type="text"
          value={formData.identifier}
          onChange={(e) => setFormData({...formData, identifier: e.target.value})}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          placeholder="Enter account identifier"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Currency *
        </label>
        <select
          value={formData.currency}
          onChange={(e) => setFormData({...formData, currency: e.target.value})}
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          {currencyOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Initial Balance *
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.balance}
          onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value) || 0})}
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          placeholder="0.00"
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          disabled={creating}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: creating ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: creating ? 'not-allowed' : 'pointer'
          }}
        >
          {creating ? 'Creating...' : 'Create Account'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={creating}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: creating ? 'not-allowed' : 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  // Mock data for testing
  const mockAccounts: Account[] = [
    { id: 1, name: "Checking Account", identifier: "check1", currency: 1, balance: 2500.50 }, // USD
    { id: 2, name: "Savings Account", identifier: "save1", currency: 1, balance: 15000.00 }, // USD
    { id: 3, name: "Business Account", identifier: "biz1", currency: 2, balance: 8750.25 } // EUR
  ];

  useEffect(() => {
    console.log('AccountsPage: Starting to fetch accounts...');
    apiRequest('/api/Account')
      .then(res => {
        console.log('AccountsPage: Response received', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('AccountsPage: Raw data received', data);
        console.log('AccountsPage: Data type:', typeof data, 'Array?', Array.isArray(data));
        if (Array.isArray(data) && data.length > 0) {
          console.log('AccountsPage: First account structure:', data[0]);
          console.log('AccountsPage: First account keys:', Object.keys(data[0]));
        }
        
        // Convert PascalCase API response to camelCase if needed
        const normalizedAccounts = Array.isArray(data) ? data.map((apiAccount: any) => ({
          id: apiAccount.Id || apiAccount.id,
          name: apiAccount.Name || apiAccount.name,
          identifier: apiAccount.Identifier || apiAccount.identifier,
          currency: apiAccount.Currency || apiAccount.currency,
          balance: apiAccount.Balance || apiAccount.balance
        })) : [];
        
        console.log('AccountsPage: Normalized accounts:', normalizedAccounts);
        setAccounts(normalizedAccounts);
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

  const handleCreateAccount = async (formData: {
    name: string;
    identifier: string;
    currency: string;
    balance: number;
  }) => {
    setCreating(true);
    try {
      const response = await apiRequest('/api/Account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          identifier: formData.identifier || null,
          currency: parseInt(formData.currency), // Convert to enum value
          balance: formData.balance,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the accounts list
      const accountsResponse = await apiRequest('/api/Account');
      const accountsData = await accountsResponse.json();
      console.log('AccountsPage: Refreshed accounts raw data:', accountsData);
      
      // Convert PascalCase API response to camelCase if needed
      const normalizedAccounts = Array.isArray(accountsData) ? accountsData.map((apiAccount: any) => ({
        id: apiAccount.Id || apiAccount.id,
        name: apiAccount.Name || apiAccount.name,
        identifier: apiAccount.Identifier || apiAccount.identifier,
        currency: apiAccount.Currency || apiAccount.currency,
        balance: apiAccount.Balance || apiAccount.balance
      })) : [];
      
      console.log('AccountsPage: Normalized refreshed accounts:', normalizedAccounts);
      setAccounts(normalizedAccounts);
      setShowCreateForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (accounts.length === 0 && !error && !useMockData) {
    return (
      <div style={{padding: '20px'}}>
        <div style={{fontSize: '18px', marginBottom: '20px'}}>
          There are no accounts defined. Please create a new account!
        </div>
        {!showCreateForm ? (
          <button 
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        ) : (
          <CreateAccountForm 
            onSubmit={handleCreateAccount} 
            onCancel={() => setShowCreateForm(false)}
            creating={creating}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{padding: '20px'}}>
      <h2>Accounts {useMockData && <span style={{fontSize: '14px', color: '#666'}}>(Mock Data)</span>}</h2>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{backgroundColor: '#f5f5f5'}}>
            <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>Name</th>
            <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>Currency</th>
            <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => {
            console.log('Rendering account:', account);
            return (
              <tr key={account.id}>
                <td style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>{account.name}</td>
                <td style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>{getCurrencyDisplay(account.currency)}</td>
                <td style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>{account.balance}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div style={{marginTop: '20px'}}>
        {!showCreateForm ? (
          <button 
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        ) : (
          <CreateAccountForm 
            onSubmit={handleCreateAccount} 
            onCancel={() => setShowCreateForm(false)}
            creating={creating}
          />
        )}
      </div>
    </div>
  );
};

export default AccountsPage;