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
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes({ analyser, theme }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing analyser={analyser} user={user} theme={theme} />} />
        <Route 
          path="/analyse" 
          element={
            <ProtectedRoute>
              <Analyser analyser={analyser} theme={theme} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard analyser={analyser} theme={theme} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <History analyser={analyser} theme={theme} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/login" 
          element={user ? <Navigate to="/analyse" replace /> : <Login theme={theme} />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/analyse" replace /> : <Signup theme={theme} />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent({ theme, setTheme, analyser }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar theme={theme} setTheme={setTheme} />
      
      <main className="flex-grow">
        <AppRoutes analyser={analyser} theme={theme} />
      </main>
    </div>
  );
}

export default function App() {
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

  return (
    <AuthProvider>
      <Router>
        <AppContent theme={theme} setTheme={setTheme} analyser={analyser} />
      </Router>
    </AuthProvider>
  );
}
