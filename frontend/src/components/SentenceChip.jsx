import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function SentenceChip({ sentence }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStyleClasses = (type) => {
    switch (type) {
      case 'hook':
        return {
          style: {
            background: "rgba(99, 102, 241, 0.1)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            color: "#A5B4FC"
          },
          hoverStyle: {
            boxShadow: "0 0 16px rgba(99, 102, 241, 0.25)",
            borderColor: "rgba(99, 102, 241, 0.5)"
          },
          badge: 'bg-[#6366F1]/20 text-[#A5B4FC]',
          desc: 'Hook Sentence: This line stands out, hooks attention immediately, and drives curiosity to click "see more".'
        };
      case 'weak':
        return {
          style: {
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#FCA5A5"
          },
          hoverStyle: {
            boxShadow: "0 0 16px rgba(239, 68, 68, 0.25)",
            borderColor: "rgba(239, 68, 68, 0.5)"
          },
          badge: 'bg-[#EF4444]/20 text-[#FCA5A5]',
          desc: 'Weak Jargon: Contains cliché corporate terminology or filler words. Rewrite this to make it punchier.'
        };
      case 'engaging':
        return {
          style: {
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#6EE7B7"
          },
          hoverStyle: {
            boxShadow: "0 0 16px rgba(16, 185, 129, 0.25)",
            borderColor: "rgba(16, 185, 129, 0.5)"
          },
          badge: 'bg-[#10B981]/20 text-[#6EE7B7]',
          desc: 'Engaging Line: Asks questions or prompts replies, helping satisfy the LinkedIn algorithm to boost reach.'
        };
      default:
        return {
          style: {
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "rgba(255, 255, 255, 0.5)"
          },
          hoverStyle: {
            borderColor: "rgba(255, 255, 255, 0.2)"
          },
          badge: 'bg-white/5 text-white/50',
          desc: 'Neutral Sentence: Standard narrative or context. Clean, but has moderate impact.'
        };
    }
  };

  const styles = getStyleClasses(sentence.type);

  return (
    <motion.div
      whileHover={{ 
        scale: 1.03, 
        y: -2,
        ...styles.hoverStyle
      }}
      style={styles.style}
      className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3.5 rounded-2xl text-sm font-medium leading-relaxed transition-all duration-305 select-none"
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
        <button className="text-white/40 hover:text-white cursor-help" aria-label="Sentence explanation">
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
            className="absolute bottom-full right-4 z-40 mb-2 w-72 rounded-xl bg-slate-900 border border-white/10 p-3 text-xs leading-normal text-white shadow-xl pointer-events-none"
          >
            <div className="font-semibold text-indigo-400 mb-1">{sentence.label} Analysis</div>
            <p className="text-white/80">{styles.desc}</p>
            {/* Small arrow */}
            <div className="absolute top-full right-6 -mt-1 h-2.5 w-2.5 rotate-45 bg-slate-900 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
