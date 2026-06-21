import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function SentenceChip({ sentence }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStyleClasses = (type) => {
    switch (type) {
      case 'hook':
        return {
          cardBg: 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-200/60 dark:border-indigo-500/30 text-indigo-700 dark:text-[#A5B4FC] hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:border-indigo-400 dark:hover:border-indigo-500/50',
          badge: 'bg-indigo-500/10 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A5B4FC]',
          desc: 'Hook Sentence: This line stands out, hooks attention immediately, and drives curiosity to click "see more".'
        };
      case 'weak':
        return {
          cardBg: 'bg-red-50/50 dark:bg-red-500/10 border-red-200/60 dark:border-red-500/30 text-red-750 dark:text-[#FCA5A5] hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] dark:hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:border-red-400 dark:hover:border-red-500/50',
          badge: 'bg-red-500/10 dark:bg-[#EF4444]/20 text-red-700 dark:text-[#FCA5A5]',
          desc: 'Weak Jargon: Contains cliché corporate terminology or filler words. Rewrite this to make it punchier.'
        };
      case 'engaging':
        return {
          cardBg: 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/30 text-emerald-750 dark:text-[#6EE7B7] hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:border-emerald-400 dark:hover:border-emerald-500/50',
          badge: 'bg-emerald-500/10 dark:bg-[#10B981]/20 text-emerald-750 dark:text-[#6EE7B7]',
          desc: 'Engaging Line: Asks questions or prompts replies, helping satisfy the LinkedIn algorithm to boost reach.'
        };
      default:
        return {
          cardBg: 'bg-slate-100/70 dark:bg-white/4 border-slate-200 dark:border-white/8 text-slate-650 dark:text-slate-400 hover:border-slate-350 dark:hover:border-white/20',
          badge: 'bg-slate-200/60 dark:bg-white/5 text-slate-500 dark:text-white/50',
          desc: 'Neutral Sentence: Standard narrative or context. Clean, but has moderate impact.'
        };
    }
  };

  const styles = getStyleClasses(sentence.type);

  return (
    <motion.div
      whileHover={{ 
        scale: 1.015, 
        y: -1.5
      }}
      className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3.5 rounded-2xl text-sm font-medium leading-relaxed transition-all duration-300 select-none border ${styles.cardBg}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Sentence Content */}
      <span className="flex-1 pr-4">{sentence.text}</span>

      {/* Interactive Badge and Tooltip Trigger */}
      <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
        <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${styles.badge}`}>
          {sentence.label}
        </span>
        <button className="text-slate-400 hover:text-slate-650 dark:text-white/40 dark:hover:text-white cursor-help" aria-label="Sentence explanation">
          <HelpCircle className="h-4 w-4 shrink-0" />
        </button>
      </div>

      {/* Floating Explanatory Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-4 z-40 mb-2 w-72 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-white/10 p-3 text-xs leading-normal text-white shadow-xl pointer-events-none"
          >
            <div className="font-semibold text-indigo-400 mb-1">{sentence.label} Analysis</div>
            <p className="text-white/80">{styles.desc}</p>
            {/* Small arrow */}
            <div className="absolute top-full right-6 -mt-1 h-2.5 w-2.5 rotate-45 bg-slate-900 dark:bg-slate-950 border-r border-b border-slate-800 dark:border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
