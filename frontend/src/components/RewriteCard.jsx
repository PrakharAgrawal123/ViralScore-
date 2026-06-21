import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Info, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function RewriteCard({ rewrite, onApply }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrite.suggested);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden"
    >
      {/* Header bar toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/40 cursor-pointer border-b border-slate-100 dark:border-slate-800/60 select-none"
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Jargon Rewrite Suggestion
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expandable Suggested Card */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-5 space-y-4"
        >
          {/* Compare original vs suggested */}
          <div className="space-y-2 text-sm leading-relaxed">
            <div className="text-slate-400 dark:text-slate-500 line-through decoration-red-400 decoration-1 bg-red-50/50 dark:bg-red-950/10 p-2.5 rounded-xl border border-dashed border-red-200/50 dark:border-red-900/20">
              <span className="text-[10px] font-bold uppercase text-red-500 block mb-1">Original Draft</span>
              "{rewrite.original}"
            </div>
            
            <div className="text-emerald-950 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/10 p-2.5 rounded-xl border border-dashed border-emerald-200/50 dark:border-emerald-900/20 font-semibold">
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">Suggested Correction</span>
              "{rewrite.suggested}"
            </div>
          </div>

          {/* Reasoning */}
          <div className="flex items-start space-x-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 p-3 text-xs leading-normal text-blue-800 dark:text-blue-300">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{rewrite.explanation}</p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleCopy}
              className="flex-grow flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:scale-[1.01] active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Rewrite</span>
                </>
              )}
            </button>

            {onApply && (
              <button
                onClick={onApply}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm shadow-blue-500/10"
              >
                Apply In Editor
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
