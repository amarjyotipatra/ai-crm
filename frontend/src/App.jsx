import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import CustomerList from './pages/CustomerList';
import CustomerDetails from './pages/CustomerDetails';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar onNavigateHome={() => setSelectedCustomerId(null)} />
        <LoginPage />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar onNavigateHome={() => setSelectedCustomerId(null)} />
      {selectedCustomerId ? (
        <CustomerDetails 
          customerId={selectedCustomerId} 
          onBack={() => setSelectedCustomerId(null)} 
        />
      ) : (
        <CustomerList 
          onSelectCustomer={(id) => setSelectedCustomerId(id)} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
