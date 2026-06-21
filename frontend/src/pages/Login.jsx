import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, ShieldAlert, RefreshCw } from 'lucide-react';
import FloatingOrbs from '../components/FloatingOrbs';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials fields.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email format.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    // Simulate login delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    // Dynamic initial generation
    const prefix = email.split('@')[0];
    const initials = (prefix.slice(0, 2) || 'US').toUpperCase();
    
    // Log user in
    onLogin({
      name: prefix.charAt(0).toUpperCase() + prefix.slice(1) || 'Alex Creator',
      email: email,
      initials: initials
    });

    navigate('/analyse');
  };

  const handleGoogleLogin = async () => {
    setError('');
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      // Simulation / demo mode
      setIsGoogleLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setIsGoogleLoading(false);
      onLogin({
        name: 'Google Creator',
        email: 'google@creator.io',
        initials: 'GC',
        authType: 'google',
        isDemo: true
      });
      navigate('/analyse');
      return;
    }

    try {
      if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
        throw new Error('Google Identity Services library not loaded yet. Please try again.');
      }

      setIsGoogleLoading(true);

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`
                }
              });

              if (!res.ok) {
                throw new Error('Failed to retrieve profile details from Google.');
              }

              const data = await res.json();
              
              let initials = 'GC';
              if (data.name) {
                const parts = data.name.split(' ');
                initials = parts.map(p => p.charAt(0)).join('').toUpperCase().slice(0, 2);
              } else if (data.email) {
                initials = data.email.slice(0, 2).toUpperCase();
              }

              onLogin({
                name: data.name || 'Google User',
                email: data.email,
                initials: initials,
                picture: data.picture,
                authType: 'google'
              });

              navigate('/analyse');
            } catch (err) {
              setError(err.message || 'An error occurred during Google Sign-In.');
            } finally {
              setIsGoogleLoading(false);
            }
          } else {
            setError('Google Sign-In authorization failed.');
            setIsGoogleLoading(false);
          }
        },
        error_callback: (err) => {
          setError(err.message || 'Google popup closed or failed.');
          setIsGoogleLoading(false);
        }
      });

      client.requestAccessToken();
    } catch (err) {
      setError(err.message || 'Google Sign-In initialization failed.');
      setIsGoogleLoading(false);
    }
  };

  const shakeVariants = {
    shake: {
      x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
      transition: { duration: 0.4 }
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98, filter: "blur(4px)" },
    animate: { 
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, y: -20, scale: 1.02, filter: "blur(4px)",
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ position: "relative", overflow: "hidden" }}
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12"
    >
      <FloatingOrbs />

      {/* Main card box */}
      <motion.div
        animate={shake ? 'shake' : ''}
        variants={shakeVariants}
        className="w-full max-w-md glass-card"
      >
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <div 
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-500/20 mb-3"
            style={{ animation: "logoPulse 3s ease-in-out infinite" }}
          >
            <Zap className="h-6 w-6 fill-current animate-float-fast" />
          </div>
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-2xl font-bold tracking-tight gradient-text" style={{ animation: "logoPulse 3s ease-in-out infinite" }}>ViralScore</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
            Welcome back
          </h2>
          <p className="text-sm text-slate-550 dark:text-white/50 mt-1 font-medium">
            Access your creator dashboard to optimize your posts.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start space-x-2 rounded-xl bg-red-500/10 text-red-650 dark:text-red-400 p-3 text-xs font-semibold mb-6 border border-red-500/20"
          >
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Address */}
          <div className="relative pt-3">
            <label 
              className={`absolute left-9 transition-all duration-200 pointer-events-none uppercase tracking-wider font-bold ${
                emailFocused || email 
                  ? 'top-[-5px] text-[11px] text-[#6366F1]' 
                  : 'top-[15px] text-[13px] text-slate-400 dark:text-white/50'
              }`}
            >
              Email Address
            </label>
            <span className="absolute top-[17px] left-3 text-slate-400 dark:text-white/40">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={email}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={(emailFocused || email) ? "you@example.com" : ""}
              className="w-full pl-9 pr-4 py-2.5 glass-input text-sm text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative pt-3">
            <label 
              className={`absolute left-9 transition-all duration-200 pointer-events-none uppercase tracking-wider font-bold ${
                passwordFocused || password 
                  ? 'top-[-5px] text-[11px] text-[#6366F1]' 
                  : 'top-[15px] text-[13px] text-slate-400 dark:text-white/50'
              }`}
            >
              Password
            </label>
            <span className="absolute top-[17px] left-3 text-slate-400 dark:text-white/40">
              <Lock className="h-4 w-4" />
            </span>
            <input
              type="password"
              value={password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={(passwordFocused || password) ? "••••••••" : ""}
              className="w-full pl-9 pr-4 py-2.5 glass-input text-sm text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none"
            />
          </div>

          {/* Remember & Forgot Row */}
          <div className="flex items-center justify-between text-sm font-bold pt-1">
            <label className="flex items-center text-slate-600 dark:text-white/60 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
              <input 
                type="checkbox" 
                className="mr-1.5 h-4 w-4 rounded border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-[#6366F1] focus:ring-[#6366F1]/50" 
              />
              Remember me
            </label>
            <a href="#" className="text-[#6366F1] hover:text-[#8B5CF6] transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl btn-glow py-3.5 font-bold disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/5" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold text-slate-400 dark:text-white/30">
            <span className="bg-white dark:bg-slate-900 px-3">Or continue with</span>
          </div>
        </div>

        {/* Simulation Mode Developer Notice */}
        {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <div className="text-[11px] text-center text-indigo-700 dark:text-[#A5B4FC] mb-3 bg-indigo-500/5 py-2 px-3 rounded-xl border border-indigo-500/10 font-bold">
            💡 Google Client ID not configured. Running in Simulation/Demo Mode.
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl btn-glass px-4 py-2.5 text-sm font-semibold hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          {isGoogleLoading ? (
            <RefreshCw className="h-4.5 w-4.5 shrink-0 animate-spin text-indigo-600 dark:text-[#A5B4FC]" />
          ) : (
            <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.65 14.99 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.86 3C6.27 7.74 8.92 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.97 3.7-8.62z"
              />
              <path
                fill="#FBBC05"
                d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.5s.14-1.78.38-2.5L1.5 6.5C.54 8.21 0 10.1 0 12s.54 3.79 1.5 5.5l3.86-3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.04.7-2.38 1.11-4.23 1.11-3.08 0-5.73-2.7-6.64-5.46L1.5 16.5C3.39 20.35 7.35 23 12 23z"
              />
            </svg>
          )}
          <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        <div className="text-center text-sm font-bold text-slate-500 dark:text-white/40 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#6366F1] hover:text-[#8B5CF6] transition-colors">
            Sign Up
          </Link>
        </div>

      </motion.div>
    </motion.div>
  );
}
