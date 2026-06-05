import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function SentenceChip({ sentence }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStyleClasses = (type) => {
    switch (type) {
      case 'hook':
        return {
          wrapper: 'bg-emerald-50 text-emerald-950 border-emerald-200/80 hover:bg-emerald-100/70 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/50',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
          desc: 'Hook Sentence: This line stands out, hooks attention immediately, and drives curiosity to click "see more".'
        };
      case 'weak':
        return {
          wrapper: 'bg-rose-50 text-rose-950 border-rose-200/80 hover:bg-rose-100/70 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/50',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
          desc: 'Weak Jargon: Contains cliché corporate terminology or filler words. Rewrite this to make it punchier.'
        };
      case 'engaging':
        return {
          wrapper: 'bg-blue-50 text-blue-950 border-blue-200/80 hover:bg-blue-100/70 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/50',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
          desc: 'Engaging Line: Asks questions or prompts replies, helping satisfy the LinkedIn algorithm to boost reach.'
        };
      default:
        return {
          wrapper: 'bg-slate-50 text-slate-800 border-slate-200/80 hover:bg-slate-100/70 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800/60',
          badge: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
          desc: 'Neutral Sentence: Standard narrative or context. Clean, but has moderate impact.'
        };
    }
  };

  const styles = getStyleClasses(sentence.type);

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3.5 rounded-2xl border text-sm font-medium leading-relaxed transition-all duration-300 select-none ${styles.wrapper}`}
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
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-help" aria-label="Sentence explanation">
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
            className="absolute bottom-full right-4 z-40 mb-2 w-72 rounded-xl bg-slate-900 dark:bg-slate-800 p-3 text-xs leading-normal text-white shadow-xl pointer-events-none"
          >
            <div className="font-semibold text-blue-400 mb-1">{sentence.label} Analysis</div>
            <p>{styles.desc}</p>
            {/* Small arrow */}
            <div className="absolute top-full right-6 -mt-1 h-2.5 w-2.5 rotate-45 bg-slate-900 dark:bg-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
