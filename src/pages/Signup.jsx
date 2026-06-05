import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, ShieldAlert } from 'lucide-react';

export default function Signup({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field validation checks
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all standard signup fields.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    // Simulate account setup delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    // Initial setup from name
    const initials = name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AC';

    onLogin({
      name: name,
      email: email,
      initials: initials
    });

    navigate('/analyse');
  };

  const shakeVariants = {
    shake: {
      x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      
      {/* Drifting gradient spheres */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px] animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-[80px] animate-float-slower" />

      {/* Main Container Card */}
      <motion.div
        animate={shake ? 'shake' : ''}
        variants={shakeVariants}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xl"
      >
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 mb-4">
            <Zap className="h-6 w-6 fill-current" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create your account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign up to unlock advanced score tracking tools.
          </p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start space-x-2 rounded-xl bg-red-50 text-red-800 p-3 text-xs font-semibold dark:bg-red-950/20 dark:text-red-400 mb-6 border border-red-150/40 dark:border-red-900/30"
          >
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Creator"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 focus:ring-1 focus:ring-blue-500/10 focus:outline-none transition-all placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@creator.io"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 focus:ring-1 focus:ring-blue-500/10 focus:outline-none transition-all placeholder-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 focus:ring-1 focus:ring-blue-500/10 focus:outline-none transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Confirm
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 focus:ring-1 focus:ring-blue-500/10 focus:outline-none transition-all placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3.5 font-bold shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all pt-3.5"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold text-slate-400">
            <span className="bg-white px-3 dark:bg-slate-900">Or sign up with</span>
          </div>
        </div>

        {/* Google OAuth Simulation */}
        <button
          onClick={() => {
            onLogin({ name: 'Google Creator', email: 'google@creator.io', initials: 'GC' });
            navigate('/analyse');
          }}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:scale-[1.01] active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
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
          <span>Continue with Google</span>
        </button>

        <div className="text-center text-xs font-bold text-slate-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Login
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
