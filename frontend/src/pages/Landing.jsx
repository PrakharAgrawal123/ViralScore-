import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, TrendingUp, BarChart3, ArrowRight, Star, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '../data/mockData';
import FloatingOrbs from '../components/FloatingOrbs';
import SentenceChip from '../components/SentenceChip';

export default function Landing({ user }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Floating background score preview animations (Desktop only)
  const floatingCards = [
    { score: 88, text: 'Building in public...', top: '15%', left: '10%', delay: 0 },
    { score: 32, text: 'We synergized solutions...', top: '25%', right: '10%', delay: 1 },
    { score: 68, text: 'Work-from-home CEOs...', bottom: '20%', left: '15%', delay: 2 },
  ];

  const SAMPLE_DRAFTS = [
    {
      id: 'draft-1',
      title: 'Buzzword Draft (Needs Work)',
      score: 38,
      estimatedReach: '200 - 800 views',
      content: "We are thrilled to announce a paradigm shift in our synergy model. Let's do a deep dive and leverage our disruptive AI to revolutionize B2B solutions! Thoughts?",
      sentences: [
        { text: "We are thrilled to announce a paradigm shift in our synergy model.", type: 'weak', label: 'Weak' },
        { text: "Let's do a deep dive and leverage our disruptive AI to revolutionize B2B solutions!", type: 'weak', label: 'Weak' },
        { text: "Thoughts?", type: 'engaging', label: 'Engaging' }
      ]
    },
    {
      id: 'draft-2',
      title: 'Viral Story (High Potential)',
      score: 88,
      estimatedReach: '35,000 - 90,000 views',
      content: "Building in public is hard. 3 years ago, I had exactly 0 followers and absolute silence. Today, our SaaS reaches 100k users. Here are the 3 strict rules we followed to scale our startup without raising VC money. 🧵👇",
      sentences: [
        { text: "Building in public is hard.", type: 'hook', label: 'Hook' },
        { text: "3 years ago, I had exactly 0 followers and absolute silence.", type: 'hook', label: 'Hook' },
        { text: "Today, our SaaS reaches 100k users.", type: 'engaging', label: 'Engaging' },
        { text: "Here are the 3 strict rules we followed to scale our startup without raising VC money. 🧵👇", type: 'engaging', label: 'Engaging' }
      ]
    },
    {
      id: 'draft-3',
      title: 'Standard Context (Average)',
      score: 55,
      estimatedReach: '4,000 - 10,000 views',
      content: "We just finalized our product strategy. Is work-from-home actually killing corporate culture? Let me know: do you prefer remote or in-office? Vote in the comments!",
      sentences: [
        { text: "We just finalized our product strategy.", type: 'neutral', label: 'Neutral' },
        { text: "Is work-from-home actually killing corporate culture?", type: 'hook', label: 'Hook' },
        { text: "Let me know: do you prefer remote or in-office? Vote in the comments!", type: 'engaging', label: 'Engaging' }
      ]
    }
  ];

  const [selectedDemoDraft, setSelectedDemoDraft] = useState(SAMPLE_DRAFTS[0]);
  const [demoText, setDemoText] = useState(SAMPLE_DRAFTS[0].content);
  const [isDemoScanning, setIsDemoScanning] = useState(false);
  const [demoScanResult, setDemoScanResult] = useState(null);

  const selectDraft = (draft) => {
    setSelectedDemoDraft(draft);
    setDemoText(draft.content);
    setDemoScanResult(null);
  };

  const handleDemoScan = () => {
    setIsDemoScanning(true);
    setTimeout(() => {
      setDemoScanResult(selectedDemoDraft);
      setIsDemoScanning(false);
    }, 1000);
  };

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

  const steps = [
    {
      num: '01',
      title: 'Draft or Paste',
      desc: 'Input your post text inside the editor. Check character length limits and quick read-time metrics instantly.'
    },
    {
      num: '02',
      title: 'Predict Potential',
      desc: 'Let the model evaluate structure, hook relevance, spacing layouts, emoji counts, and numerical indicators.'
    },
    {
      num: '03',
      title: 'Replace Jargon',
      desc: 'View highlight chips for dry sentences and click suggested replacements to improve professional tone.'
    },
    {
      num: '04',
      title: 'Publish & Grow',
      desc: 'Schedule and copy your optimized posts for the high-engagement hours recommended for your industry.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free Creator',
      price: '$0',
      period: 'forever',
      desc: 'Perfect for content hobbyists beginning their branding journey.',
      features: [
        '3 virality checks per day',
        'Basic sentence highlight scans',
        'Word and reading time count',
        'Local dashboard logs history'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro Solopreneur',
      price: '$19',
      period: 'per month',
      desc: 'For active creators looking to compound their organic impressions.',
      features: [
        'Unlimited virality checks',
        'Unlimited AI rewrite suggestions',
        'Complete creator analytics trends',
        'Best time to post calendar',
        'Priority feature updates'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Agency Pro',
      price: '$49',
      period: 'per month',
      desc: 'Designed for marketing teams and collaborative social managers.',
      features: [
        'Collaborative workspace (3 seats)',
        'Exportable client analytics files',
        'Custom tone settings presets',
        'Dedicated account manager support'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const FAQS = [
    {
      question: "How is the virality score calculated?",
      answer: "Our prediction model evaluates sentence hook strength, spacing distributions, professional jargon levels, numbers usage, and emoji density. It benchmarks this against a dataset of 50,000+ top creator posts to estimate organic reach potential."
    },
    {
      question: "Do you store my drafts on your server?",
      answer: "No, security and privacy are paramount. Your drafts are processed dynamically and saved only to your local browser storage (localStorage). We do not record or share your draft copy on external databases."
    },
    {
      question: "What counts as 'weak jargon'?",
      answer: "Overused corporate words like 'synergize', 'leverage', 'paradigm shift', and 'deep dive' dilute engagement. The AI highlights these and offers clean, conversational rewrites."
    },
    {
      question: "Can I use ViralScore on mobile browsers?",
      answer: "Yes, our web application is fully responsive. You can paste, scan, rewrite, and read your dashboards on any mobile browser or tablet screen seamlessly."
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
      className="relative overflow-hidden min-h-screen text-slate-850 dark:text-slate-100"
    >
      <FloatingOrbs />
      
      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 lg:pt-28">
          
          {/* Floating preview cards behind text on desktop */}
          <div className="hidden lg:block absolute inset-0 -z-10 pointer-events-none">
            {floatingCards.map((card, idx) => (
              <motion.div
                key={idx}
                style={{ top: card.top, left: card.left, right: card.right, bottom: card.bottom }}
                className="absolute w-60 glass-card"
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
                  <span className="text-[13px] font-bold text-slate-500 dark:text-white/40">Post Draft Preview</span>
                  <span className="font-extrabold text-xs text-indigo-650 dark:text-[#A5B4FC]">{card.score} Score</span>
                </div>
                <p className="text-xs text-slate-650 dark:text-white/60 italic truncate font-medium">"{card.text}"</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{
                border: "1px solid rgba(99,102,241,0.3)",
                background: "rgba(99,102,241,0.08)",
                color: "#6366F1"
              }}
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span className="dark:text-indigo-200">✦ AI-Powered Engagement Predictor</span>
            </motion.div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl leading-[1.1] flex flex-wrap justify-center gap-x-3 gap-y-1">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
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
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mx-auto max-w-2xl text-base text-slate-600 dark:text-white/60 sm:text-lg md:text-xl leading-relaxed font-medium"
            >
              The advanced copy analyser for creators and solopreneurs. Score your drafts, fix dry jargon phrasing, and publish at the absolute peak corporate engagement hour.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/analyse"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl btn-glow px-8 py-4 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-base"
              >
                Analyse your post
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <a
                href="#quick-demo"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl btn-glass px-8 py-4 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-base"
              >
                Try Quick Scanner
              </a>
            </motion.div>
          </div>
        </section>

        {/* INTERACTIVE QUICK SCANNER DEMO SECTION */}
        <section id="quick-demo" className="py-16 border-t border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-slate-900/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#6366F1]">Interactive Demo</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
                Test the Scanner Live
              </h3>
              <p className="text-slate-500 dark:text-white/50 max-w-xl mx-auto text-base font-medium">
                Select a preset LinkedIn draft style or edit the copy yourself, then run the scan simulation to see results.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 items-stretch max-w-5xl mx-auto">
              
              {/* Left Column: Preset buttons & interactive textarea */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_DRAFTS.map((draft) => (
                    <button
                      key={draft.id}
                      onClick={() => selectDraft(draft)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedDemoDraft.id === draft.id
                          ? 'bg-[#6366F1] text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-350'
                      }`}
                    >
                      {draft.title}
                    </button>
                  ))}
                </div>

                <div className="glass-card flex-grow flex flex-col space-y-4">
                  <textarea
                    value={demoText}
                    onChange={(e) => {
                      setDemoText(e.target.value);
                      setDemoScanResult(null);
                    }}
                    placeholder="Type or edit your LinkedIn post..."
                    className="w-full min-h-[160px] flex-grow bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 p-4 rounded-xl text-sm leading-relaxed text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/20 resize-none focus:outline-none focus:border-[#6366F1]"
                  />
                  
                  <button
                    onClick={handleDemoScan}
                    disabled={isDemoScanning || !demoText.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl btn-glow py-3.5 font-bold cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isDemoScanning ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>AI Scanning Copy...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4.5 w-4.5 fill-current" />
                        <span>Scan Draft Preview</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Scan Result Panel */}
              <div className="lg:col-span-5 flex">
                <div className="glass-card w-full flex flex-col justify-between min-h-[300px]">
                  <AnimatePresence mode="wait">
                    {demoScanResult ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 flex-grow flex flex-col justify-between"
                      >
                        <div>
                          <div className="text-center pb-4 border-b border-slate-200 dark:border-white/5">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[#6366F1] mb-2">Simulated Scan Score</h4>
                            <div className="flex items-baseline justify-center space-x-1">
                              <span className={`text-5xl font-black ${
                                demoScanResult.score >= 70
                                  ? 'text-indigo-600 dark:text-[#A5B4FC]'
                                  : demoScanResult.score < 40
                                  ? 'text-red-500'
                                  : 'text-amber-500'
                              }`}>
                                {demoScanResult.score}
                              </span>
                              <span className="text-sm font-bold text-slate-400 dark:text-white/30 uppercase">/ 100</span>
                            </div>
                            <p className="text-[13px] text-slate-500 dark:text-white/40 mt-1 font-semibold">
                              Est. Reach: <span className="text-slate-800 dark:text-white font-bold">{demoScanResult.estimatedReach}</span>
                            </p>
                          </div>

                          <div className="pt-4 space-y-2">
                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-2">Line-by-Line Breakdown</h5>
                            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                              {demoScanResult.sentences.map((sent, idx) => (
                                <SentenceChip key={idx} sentence={sent} />
                              ))}
                            </div>
                          </div>
                        </div>

                        {demoScanResult.score < 40 && (
                          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-300 font-medium">
                            ⚠️ This draft contains heavy corporate buzzwords. Sign up to get one-click conversational AI suggestions to rewrite them!
                          </div>
                        )}
                        {demoScanResult.score >= 70 && (
                          <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-200 font-medium">
                            🎉 Outstanding copy! Strong hooks, clear spacing, and conversational wording will maximize reach.
                          </div>
                        )}
                        {demoScanResult.score >= 40 && demoScanResult.score < 70 && (
                          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-200 font-medium">
                            💡 Good basic copy. Refactoring neutral sections into engaging questions will boost comments by 15%.
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center text-center py-10 flex-grow"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-[#6366F1] mb-4">
                          <Zap className="h-5 w-5" />
                        </div>
                        <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2">Scan Results Pending</h4>
                        <p className="text-xs text-slate-500 dark:text-white/40 max-w-[200px] leading-relaxed font-semibold">
                          Press the 'Scan Draft Preview' button on the left to simulate our AI analysis engines.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* PROCESS / WORKFLOW SECTION */}
        <section className="py-16 bg-transparent border-t border-slate-200 dark:border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#6366F1]">How It Works</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
                4 Steps to Optimization
              </h3>
              <p className="text-slate-500 dark:text-white/50 max-w-xl mx-auto text-base font-medium">
                Our simple yet powerful pipeline is engineered to elevate your LinkedIn professional branding in minutes.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((st, i) => (
                <div key={i} className="glass-card relative flex flex-col justify-between hover-lift">
                  <div>
                    <span className="absolute top-4 right-5 text-4xl font-black text-indigo-500/10 dark:text-indigo-500/20">{st.num}</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-[#6366F1] mb-5 font-extrabold text-sm">
                      {st.num}
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{st.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-white/50 leading-relaxed font-medium">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* FEATURE SECTION */}
        <section id="how-it-works" className="py-16 border-t border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-slate-900/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#6366F1]">Features Checklist</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
                Engineered for High-Impact Copy
              </h3>
              <p className="text-slate-500 dark:text-white/50 max-w-xl mx-auto text-base font-medium">
                Every detail is calibrated to help your drafts escape the bottom feeds and gain organic traction.
              </p>
            </div>

            {/* Cards Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {features.map((feat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group flex flex-col justify-between glass-card transition-all hover-lift"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-[#6366F1] group-hover:scale-110 transition-transform duration-200 mb-5">
                      <feat.icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white leading-tight mb-2">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-white/50 leading-relaxed font-medium">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* PRICING PLANS SECTION */}
        <section className="py-16 border-t border-slate-200 dark:border-white/5 bg-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#6366F1]">Simple Pricing</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
                Calibrated for Every Stage
              </h3>
              <p className="text-slate-500 dark:text-white/50 max-w-xl mx-auto text-base font-medium">
                Choose the plan that fits your growth targets. From casual creators to dedicated content marketing squads.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
              {pricingPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col justify-between rounded-2xl p-6 glass-card transition-all hover-lift ${
                    plan.popular
                      ? 'border-[#6366F1]/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] ring-2 ring-[#6366F1]/30'
                      : 'border-slate-200 dark:border-white/5'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute top-0 right-6 transform -translate-y-1/2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-800 dark:text-white">{plan.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-white/40 mt-1 leading-normal font-semibold">{plan.desc}</p>
                    </div>

                    <div className="flex items-baseline space-x-1.5 py-2 border-b border-slate-200 dark:border-white/5">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                      <span className="text-xs font-bold text-slate-400 dark:text-white/30 uppercase">{plan.period}</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-650 dark:text-white/70 font-semibold pt-2">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <Link
                      to={user ? "/analyse" : "/signup"}
                      className={`block w-full text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                        plan.popular
                          ? 'btn-glow text-white'
                          : 'btn-glass text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SOCIAL PROOF SECTION */}
        <section className="py-16 bg-slate-100/30 dark:bg-slate-900/10 border-t border-slate-200 dark:border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#6366F1]">Social Proof</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
                Backed by Top Networkers
              </h3>
              <p className="text-slate-500 dark:text-white/50 max-w-xl mx-auto text-base font-medium">
                Discover how executive coaches, startup founders, and technical creators use our analyser to improve conversions.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
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
                    <div className="flex items-center space-x-1 text-amber-500 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-650 dark:text-white/70 italic leading-relaxed mb-6 font-semibold">
                      "{test.quote}"
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3 border-t border-slate-200 dark:border-white/5 pt-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-black text-sm ${test.color}`}>
                      {test.initials}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800 dark:text-white leading-normal">{test.author}</h5>
                      <p className="text-[11px] text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider">{test.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="py-16 border-t border-slate-200 dark:border-white/5 bg-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#6366F1]">Got Questions?</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
                Frequently Answered Details
              </h3>
              <p className="text-slate-500 dark:text-white/50 max-w-xl mx-auto text-base font-medium">
                Everything you need to know about the prediction engine, data processing, and platform features.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="glass-card !p-0 overflow-hidden border border-slate-200 dark:border-white/5 transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left font-bold text-slate-800 dark:text-white hover:text-[#6366F1] dark:hover:text-indigo-200 transition-colors select-none text-sm cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-[#6366F1]" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-5 pt-1 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-white/50 leading-relaxed font-semibold">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/20 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-[#6366F1]" />
                <span className="text-lg font-bold tracking-tight text-slate-850 dark:text-white">
                  Viral<span className="text-[#6366F1]">Score</span>
                </span>
              </div>

              {/* Links */}
              <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider">
                <Link to="/analyse" className="hover:text-[#6366F1] transition-colors">Draft Analyser</Link>
                <Link to="/dashboard" className="hover:text-[#6366F1] transition-colors">Performance Dashboard</Link>
                <Link to="/history" className="hover:text-[#6366F1] transition-colors">Analysis Log</Link>
                <a href="#" className="hover:text-[#6366F1] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#6366F1] transition-colors">Terms of Service</a>
              </div>

              {/* Copyright */}
              <span className="text-xs text-slate-400 dark:text-white/30 font-bold uppercase tracking-wider">
                © {new Date().getFullYear()} ViralScore. All rights reserved.
              </span>

            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
