import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import { LogOut, Home } from 'lucide-react';

// A simple layout component for dashboards that need a navbar
const DashboardLayout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link to={user?.role === 'admin' ? "/admin-dashboard" : "/sales-dashboard"} className="text-xl font-bold flex items-center gap-2">
                        <Home className="w-6 h-6" /> {user?.role === 'admin' ? "Admin" : "Sales"} Portal
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    {user && (
                        <>
                            <span className="text-sm">Welcome, <span className="font-semibold">{user.name}</span>!</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomeRedirect />} /> {/* Redirects authenticated users */}

          {/* Protected Admin Route */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
          </Route>

          {/* Protected Sales Route */}
          <Route element={<ProtectedRoute allowedRoles={['sales']} />}>
            <Route path="/sales-dashboard" element={<DashboardLayout><SalesDashboard /></DashboardLayout>} />
          </Route>

          {/* Fallback for unauthenticated attempts to access dashboard-like paths */}
          <Route path="/admin-dashboard" element={<LoginPage />} />
          <Route path="/sales-dashboard" element={<LoginPage />} />
          
          {/* Catch-all for undefined routes - redirect to login or home */}
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Component to handle initial redirection based on auth state
const HomeRedirect = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin-dashboard', { replace: true });
            } else if (user.role === 'sales') {
                navigate('/sales-dashboard', { replace: true });
            } else {
                navigate('/login', { replace: true }); // Unknown role
            }
        } else {
            navigate('/login', { replace: true }); // No user
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Redirecting...</p>
            </div>
        </div>
    );
};

const NotFoundRedirect = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin-dashboard', { replace: true });
            } else if (user.role === 'sales') {
                navigate('/sales-dashboard', { replace: true });
            }
        } else {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">404</h1>
                <p className="mt-2 text-lg text-gray-600">Page not found.</p>
                <p className="mt-4 text-gray-600">Redirecting to your dashboard or login page...</p>
            </div>
        </div>
    );
};

export default App;
