import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';

const App = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');

  const handleLoginSuccess = () => {
    if (user?.role === 'admin') {
      setCurrentPage('admin');
    } else if (user?.role === 'sales') {
      setCurrentPage('sales');
    }
  };

  if (!user && currentPage !== 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'admin' && user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (currentPage === 'sales' && user?.role === 'sales') {
    return <SalesDashboard />;
  }

  // Fallback: redirect to login if user role doesn't match or page is invalid
  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
};

export default App;
