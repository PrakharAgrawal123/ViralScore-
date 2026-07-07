/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure backend API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

// Axios request interceptor to automatically attach JWT token on every call
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('viralscore_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verification helper to query current session user details
  const verifySession = async () => {
    const token = localStorage.getItem('viralscore_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data);
    } catch (err) {
      console.error('Session verification failed, logging out.', err);
      localStorage.removeItem('viralscore_token');
      localStorage.removeItem('viralscore_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Extract token parameter from URL (used by Google OAuth callback redirects)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('viralscore_token', tokenFromUrl);
      // Clean query string from window history
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    verifySession();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('viralscore_token', token);
    localStorage.setItem('viralscore_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const response = await axios.post('/auth/signup', { name, email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('viralscore_token', token);
    localStorage.setItem('viralscore_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await axios.get('/auth/logout');
    } catch (err) {
      console.error('Failed call to logout route', err);
    } finally {
      localStorage.removeItem('viralscore_token');
      localStorage.removeItem('viralscore_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
