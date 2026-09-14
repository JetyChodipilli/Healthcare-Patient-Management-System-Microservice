import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Register from './components/Register';
import PatientDashboard from './components/PatientDashboard';

// Decode a JWT payload without a library (base64 decode the middle section)
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole]   = useState(() => localStorage.getItem('role') || 'STAFF');
  const [view, setView]   = useState('login');

  // Multi-tab sync protection
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token was removed in another tab, log out here instantly
        setToken(null);
        setRole('STAFF');
        setView('login');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (newToken, fallbackRole) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);

    // Decode role from JWT claims; fall back to whatever the UI selected
    const payload = decodeJwtPayload(newToken);
    const resolvedRole = payload.role || fallbackRole || 'STAFF';
    localStorage.setItem('role', resolvedRole);
    setRole(resolvedRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole('STAFF');
    setView('login');
  };

  return (
    <>
      <Toaster theme="dark" position="top-right" richColors closeButton />
      <AnimatePresence mode="wait">
        {!token ? (
          view === 'login' ? (
            <Login
              key="login"
              onLogin={handleLogin}
              onNavigateToRegister={() => setView('register')}
            />
          ) : (
            <Register
              key="register"
              onNavigateToLogin={() => setView('login')}
              onRegisterSuccess={() => setView('login')}
            />
          )
        ) : (
          <PatientDashboard
            key="dashboard"
            token={token}
            role={role}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
