import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Sparkles, TrendingUp, BarChart3, ArrowRight, Star } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '../data/mockData';
import FloatingOrbs from '../components/FloatingOrbs';

export default function Landing() {
  
  // Floating background score preview animations
  const floatingCards = [
    { score: 88, text: 'Building in public...', top: '15%', left: '10%', delay: 0 },
    { score: 32, text: 'We synergized solutions...', top: '25%', right: '10%', delay: 1 },
    { score: 68, text: 'Work-from-home CEOs...', bottom: '20%', left: '15%', delay: 2 },
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

  const headlineWords = "Know if your post will go viral — before you post it".split(" ");

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative overflow-hidden min-h-screen"
    >
      <FloatingOrbs />
      
      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-32">
          
          {/* Floating preview cards behind text on desktop */}
          <div className="hidden lg:block absolute inset-0 -z-10 pointer-events-none">
            {floatingCards.map((card, idx) => (
              <motion.div
                key={idx}
                style={{ top: card.top, left: card.left, right: card.right, bottom: card.bottom }}
                className="absolute w-60 glass-card text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -12, 0]
                }}
                transition={{ 
                  opacity: { delay: card.delay, duration: 0.6 },
                  scale: { delay: card.delay, duration: 0.6 },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: card.delay * 0.7
                  }
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[15px] font-bold text-white/40">Post Draft Preview</span>
                  <span className="font-extrabold text-sm text-[#A5B4FC]">{card.score} Score</span>
                </div>
                <p className="text-xs text-white/60 italic truncate font-medium">"{card.text}"</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rounded-full px-3 py-1 text-base font-semibold"
              style={{
                border: "1px solid rgba(99,102,241,0.4)",
                background: "rgba(99,102,241,0.1)",
                color: "#A5B4FC"
              }}
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>✦ AI-Powered Analysis</span>
            </motion.div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1] flex flex-wrap justify-center gap-x-3 gap-y-1">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  {i >= 8 ? (
                    <span className="gradient-text">{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mx-auto max-w-2xl text-base text-white/60 sm:text-lg md:text-xl leading-relaxed"
            >
              AI-powered LinkedIn post analyser. Score your draft, fix weak jargon lines, and post at the absolute peak corporate engagement hour.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/analyse"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl btn-glow px-8 py-4 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Analyse your post
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <a
                href="#how-it-works"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl btn-glass px-8 py-4 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                See how it works
              </a>
            </motion.div>
          </div>
        </section>

        {/* FEATURE SECTION */}
        <section id="how-it-works" className="py-20 border-t border-white/5 bg-slate-900/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <h2 className="text-base font-bold uppercase tracking-widest text-[#6366F1]">Features Checklist</h2>
              <h3 className="text-4xl font-extrabold text-white tracking-tight sm:text-4xl">
                Engineered for High-Impact Copy
              </h3>
              <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
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
                  className="group flex flex-col justify-between glass-card transition-all hover-lift"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-[#A5B4FC] group-hover:scale-110 transition-transform duration-200 mb-5">
                      <feat.icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white leading-tight mb-2">
                      {feat.title}
                    </h4>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* SOCIAL PROOF SECTION */}
        <section className="py-20 bg-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <h2 className="text-base font-bold uppercase tracking-widest text-[#6366F1]">Social Proof</h2>
              <h3 className="text-4xl font-extrabold text-white tracking-tight sm:text-4xl">
                Backed by Top Networkers
              </h3>
              <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
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
                  className="flex flex-col justify-between glass-card"
                >
                  <div>
                    <div className="flex items-center space-x-1 text-amber-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-white/70 italic leading-relaxed mb-6 font-medium">
                      "{test.quote}"
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3 border-t border-white/5 pt-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-base ${test.color}`}>
                      {test.initials}
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-white">{test.author}</h5>
                      <p className="text-[15px] text-white/40 font-semibold">{test.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/5 bg-slate-950/20 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-[#6366F1]" />
                <span className="text-lg font-bold tracking-tight text-white">
                  Viral<span className="text-[#6366F1]">Score</span>
                </span>
              </div>

              {/* Links */}
              <div className="flex flex-wrap justify-center gap-6 text-base text-white/50 font-medium">
                <Link to="/analyse" className="hover:text-[#6366F1] transition-colors">Draft Analyser</Link>
                <Link to="/dashboard" className="hover:text-[#6366F1] transition-colors">Performance Dashboard</Link>
                <Link to="/history" className="hover:text-[#6366F1] transition-colors">Analysis Log</Link>
                <a href="#" className="hover:text-[#6366F1] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#6366F1] transition-colors">Terms of Service</a>
              </div>

              {/* Copyright */}
              <span className="text-base text-white/30 font-medium">
                © {new Date().getFullYear()} ViralScore. All rights reserved.
              </span>

            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
