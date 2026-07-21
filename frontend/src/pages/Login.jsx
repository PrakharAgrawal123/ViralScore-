import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, ShieldAlert, RefreshCw, X, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FloatingOrbs from '../components/FloatingOrbs';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Forgot Password flow states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Verify Code & Reset
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError('Please enter a valid email format.');
      return;
    }

    try {
      setIsForgotLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email: forgotEmail });
      setForgotSuccess(res.data.message || 'Verification code sent to your email.');
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.response?.data?.error || 'Failed to send reset code. Please try again.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotCode.trim() || !forgotNewPassword.trim() || !forgotConfirmPassword.trim()) {
      setForgotError('All fields are required.');
      return;
    }

    if (forgotNewPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    try {
      setIsForgotLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/auth/reset-password`, {
        email: forgotEmail,
        code: forgotCode,
        new_password: forgotNewPassword
      });
      setForgotSuccess(res.data.message || 'Password reset successfully!');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotEmail('');
        setForgotCode('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setForgotSuccess('');
        setForgotError('');
      }, 2500);
    } catch (err) {
      setForgotError(err.response?.data?.error || 'Failed to reset password. Check code and try again.');
    } finally {
      setIsForgotLoading(false);
    }
  };

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

    try {
      setIsLoading(true);
      await login(email, password);
      navigate('/analyse');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials or connection error.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${API_URL}/auth/google`;
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
            <button 
              type="button" 
              onClick={() => {
                setShowForgotModal(true);
                setForgotStep(1);
                setForgotError('');
                setForgotSuccess('');
              }}
              className="text-[#6366F1] hover:text-[#8B5CF6] transition-colors cursor-pointer bg-transparent border-none outline-none p-0 font-bold"
            >
              Forgot password?
            </button>
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

      {/* Forgot Password Modal Overlay */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#07070F] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-655 dark:hover:text-white transition-colors hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-[#6366F1] mb-3">
                  <Key className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Reset your password
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/45 mt-1 font-medium">
                  {forgotStep === 1 
                    ? "Enter your email address to receive a 6-digit verification code." 
                    : "Enter the verification code sent to your email along with your new password."}
                </p>
              </div>

              {/* Success / Error Alerts */}
              {forgotError && (
                <div className="flex items-start space-x-2 rounded-xl bg-red-500/10 text-red-650 dark:text-red-400 p-3 text-xs font-semibold mb-4 border border-red-500/20">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{forgotError}</span>
                </div>
              )}
              {forgotSuccess && (
                <div className="rounded-xl bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 p-3 text-xs font-semibold mb-4 border border-emerald-500/20">
                  {forgotSuccess}
                </div>
              )}

              {/* Step 1: Send Code */}
              {forgotStep === 1 ? (
                <form onSubmit={handleSendResetCode} className="space-y-4">
                  <div className="relative">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute top-[13px] left-3 text-slate-400 dark:text-white/40">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-9 pr-4 py-2.5 glass-input text-sm text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl btn-glow py-3 font-bold disabled:opacity-50 transition-all cursor-pointer text-sm"
                  >
                    {isForgotLoading ? 'Sending Code...' : 'Send Verification Code'}
                  </button>
                </form>
              ) : (
                /* Step 2: Code & New Password */
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider block mb-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      required
                      className="w-full px-4 py-2.5 glass-input text-sm text-center font-bold tracking-widest text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider block mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute top-[13px] left-3 text-slate-400 dark:text-white/40">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-4 py-2.5 glass-input text-sm text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider block mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <span className="absolute top-[13px] left-3 text-slate-400 dark:text-white/40">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-4 py-2.5 glass-input text-sm text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 text-slate-655 dark:text-white/80 py-2.5 font-bold hover:bg-slate-50 dark:hover:bg-white/5 text-sm transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading}
                      className="flex-[2] flex items-center justify-center gap-2 rounded-xl btn-glow py-2.5 font-bold disabled:opacity-50 transition-all cursor-pointer text-sm"
                    >
                      {isForgotLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
