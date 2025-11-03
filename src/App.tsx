import React from 'react';
import logo from './logo.svg';
import './App.css';
import AccountsPage from './pages/AccountsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>MyFinance</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<AccountsPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            {/* Add other routes here if needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
