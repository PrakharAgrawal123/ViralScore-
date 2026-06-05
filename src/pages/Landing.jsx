import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Sparkles, TrendingUp, HelpCircle, BarChart3, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '../data/mockData';

export default function Landing() {
  
  // Floating background score preview animations
  const floatingCards = [
    { score: 88, text: 'Building in public...', top: '15%', left: '10%', delay: 0, color: 'border-emerald-500 text-emerald-500 glow-green animate-float-slow' },
    { score: 32, text: 'We synergized solutions...', top: '25%', right: '10%', delay: 1, color: 'border-red-500 text-red-500 glow-red animate-float-slower' },
    { score: 68, text: 'Work-from-home CEOs...', bottom: '20%', left: '15%', delay: 2, color: 'border-amber-500 text-amber-500 glow-amber animate-float-slow' },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Score Prediction',
      description: 'Get an instant virality score based on real-time LinkedIn engagement factors and metric statistics.'
    },
    {
      icon: Zap,
      title: 'Sentence Breakdown',
      description: 'We highlight hooks in green, neutral context in gray, and flag weak jargon lines in warning red.'
    },
    {
      icon: Sparkles,
      title: 'AI Rewrite Suggestions',
      description: 'Receive punchy, conversational alternatives for sentences flagged as dry, passive, or full of filler words.'
    },
    {
      icon: BarChart3,
      title: 'Best Time to Post',
      description: 'Determine the exact high-density posting times based on professional corporate scrolling calendars.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      
      {/* Background soft color blurs */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-900/15" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-400/10 blur-[100px] dark:bg-purple-900/10" />

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-32">
        
        {/* Floating preview cards behind text on desktop */}
        <div className="hidden lg:block absolute inset-0 -z-10 pointer-events-none">
          {floatingCards.map((card, idx) => (
            <motion.div
              key={idx}
              style={{ top: card.top, left: card.left, right: card.right, bottom: card.bottom }}
              className={`absolute w-60 rounded-2xl border bg-white/95 dark:bg-slate-900/95 p-4 shadow-xl ${card.color}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: card.delay, duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400">Post Draft Preview</span>
                <span className="font-extrabold text-sm">{card.score} Score</span>
              </div>
              <p className="text-xs text-slate-500 italic truncate font-medium">"{card.text}"</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 rounded-full border border-blue-200/80 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>AI-Driven Optimization Suite</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl leading-[1.1]"
          >
            Know if your post will go viral — <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">before you post it</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-base text-slate-500 dark:text-slate-400 sm:text-lg md:text-xl leading-relaxed"
          >
            AI-powered LinkedIn post analyser. Score your draft, fix weak jargon lines, and post at the absolute peak corporate engagement hour.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/analyse"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Analyse your post
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/50 backdrop-blur px-8 py-4 font-semibold text-slate-700 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-900 transition-all"
            >
              See how it works
            </a>
          </motion.div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section id="how-it-works" className="py-20 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Features Checklist</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
              Engineered for High-Impact Copy
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Every detail is calibrated to help your drafts escape the bottom feeds and gain real organic traction.
            </p>
          </div>

          {/* Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-6 hover:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-400 shadow-sm transition-all hover-lift"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200 mb-5">
                    <feat.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-2">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Social Proof</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
              Backed by Top Networkers
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Discover how executive coaches, startup founders, and technical creators use our analyser to improve conversions.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {MOCK_TESTIMONIALS.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 dark:bg-slate-900/30 p-6 dark:border-slate-850"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed mb-6 font-medium">
                    "{test.quote}"
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm ${test.color}`}>
                    {test.initials}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{test.author}</h5>
                    <p className="text-[10px] text-slate-500 font-semibold">{test.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Viral<span className="text-blue-600">Score</span>
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium">
              <Link to="/analyse" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Draft Analyser</Link>
              <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Performance Dashboard</Link>
              <Link to="/history" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Analysis Log</Link>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
            </div>

            {/* Copyright */}
            <span className="text-xs text-slate-400 font-medium">
              © {new Date().getFullYear()} ViralScore. All rights reserved.
            </span>

          </div>
        </div>
      </footer>

    </div>
  );
}
