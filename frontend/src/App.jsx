import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Analyser from './pages/Analyser';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Signup from './pages/Signup';
import useAnalyser from './hooks/useAnalyser';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes({ user, analyser, handleLogin, theme }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing analyser={analyser} user={user} theme={theme} />} />
        <Route 
          path="/analyse" 
          element={
            <ProtectedRoute user={user}>
              <Analyser analyser={analyser} user={user} theme={theme} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard analyser={analyser} user={user} theme={theme} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute user={user}>
              <History analyser={analyser} user={user} theme={theme} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/login" 
          element={user ? <Navigate to="/analyse" replace /> : <Login onLogin={handleLogin} theme={theme} />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/analyse" replace /> : <Signup onLogin={handleLogin} theme={theme} />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('viralscore_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('viralscore_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('viralscore_theme', theme);
  }, [theme]);

  const analyser = useAnalyser();

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('viralscore_user', JSON.stringify(userInfo));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('viralscore_user');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Navbar user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} />
        
        <main className="flex-grow">
          <AppRoutes user={user} analyser={analyser} handleLogin={handleLogin} theme={theme} />
        </main>
      </div>
    </Router>
  );
}
