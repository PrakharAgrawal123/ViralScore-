import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Trash2 } from 'lucide-react';

export default function PostCard({ post, onView, onDelete }) {
  
  // Scoring badge color resolver
  const getBadgeClasses = (val) => {
    if (val < 40) {
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50';
    } else if (val < 70) {
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50';
    } else {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50';
    }
  };

  const truncateText = (text, len = 100) => {
    if (text.length <= len) return text;
    return text.slice(0, len) + '...';
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-400 shadow-sm transition-all"
    >
      <div>
        {/* Top Header Card Info */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold ${getBadgeClasses(post.score)}`}>
            {post.score} Score
          </span>
          
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span className="flex items-center">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {post.time}
            </span>
          </div>
        </div>

        {/* Post Text Snippet Preview */}
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 break-words font-medium">
          {truncateText(post.content)}
        </p>
      </div>

      {/* Footer CTA and Deletes */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
        <button
          onClick={onView}
          className="flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          View Analysis
          <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          title="Delete Analysis"
          aria-label="Delete analysis"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
