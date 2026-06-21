import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, Sun, Moon, LogOut } from 'lucide-react';

export default function Navbar({ user, onLogout, theme, setTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyse', path: '/analyse' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'History', path: '/history' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className="sticky top-0 z-50 w-full transition-all duration-400 ease"
      style={scrolled ? {
        background: theme === 'dark' ? "rgba(7, 7, 15, 0.8)" : "rgba(248, 250, 252, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: theme === 'dark' ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow: theme === 'dark' ? "0 4px 30px rgba(0, 0, 0, 0.3)" : "0 4px 30px rgba(0, 0, 0, 0.03)"
      } : {
        background: "transparent",
        borderBottom: "none"
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200"
              style={{ animation: "logoPulse 3s ease-in-out infinite" }}
            >
              <Zap className="h-5 w-5 fill-current animate-float-fast" />
            </div>
            <span 
              className="text-xl font-bold tracking-tight gradient-text"
              style={{ animation: "logoPulse 3s ease-in-out infinite" }}
            >
              ViralScore
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-1 py-2 text-base font-semibold transition-colors duration-205 ${
                  isActive(link.path)
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeLink"
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-[#6366F1]"
                    style={{
                      filter: "drop-shadow(0 2px 4px rgba(99, 102, 241, 0.8))"
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Settings & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100/50 text-slate-600 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-350 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-amber-400" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-white/10">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-9 w-9 rounded-xl object-cover border border-indigo-500/20 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-[#A5B4FC] font-semibold text-sm border border-indigo-500/20">
                    {user.initials}
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-slate-800 dark:text-white/90">{user.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-white/50">{user.email}</div>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 dark:text-white/40 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-white/70 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl btn-glow px-4 py-2 text-sm font-medium transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100/50 text-slate-600 hover:bg-slate-200 dark:border-white/10 dark:text-slate-350 dark:hover:bg-white/10 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100/50 text-slate-600 hover:bg-slate-200 dark:border-white/10 dark:text-slate-350 dark:hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-200 dark:border-white/5 bg-slate-50/95 dark:bg-[#07070F]/95 backdrop-blur-lg px-4 py-4 space-y-3"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-base font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-[#A5B4FC] border-l-2 border-[#6366F1]'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-white/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/5">
              {user ? (
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center space-x-3">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="h-10 w-10 rounded-xl object-cover border border-indigo-500/20 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-[#A5B4FC] font-semibold border border-indigo-500/20">
                        {user.initials}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white/90">{user.name}</div>
                      <div className="text-xs text-slate-500 dark:text-white/50">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setIsOpen(false);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex h-10 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-600 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex h-10 items-center justify-center rounded-lg btn-glow text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
