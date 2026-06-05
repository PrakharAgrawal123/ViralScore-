import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Analyser from './pages/Analyser';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Signup from './pages/Signup';
import useAnalyser from './hooks/useAnalyser';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('viralscore_user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Alex Creator',
      email: 'alex@creator.io',
      initials: 'AC'
    };
  });

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
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing analyser={analyser} user={user} />} />
            <Route path="/analyse" element={<Analyser analyser={analyser} user={user} />} />
            <Route path="/dashboard" element={<Dashboard analyser={analyser} user={user} />} />
            <Route path="/history" element={<History analyser={analyser} user={user} />} />
            
            <Route 
              path="/login" 
              element={user ? <Navigate to="/analyse" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/analyse" /> : <Signup onLogin={handleLogin} />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
