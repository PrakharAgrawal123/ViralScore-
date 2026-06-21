import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Trash2 } from 'lucide-react';

export default function PostCard({ post, onView, onDelete }) {
  
  // Scoring badge style class resolver
  const getBadgeStyle = (val) => {
    if (val < 40) {
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.1)] dark:shadow-[0_0_12px_rgba(239,68,68,0.3)]';
    } else if (val < 70) {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)] dark:shadow-[0_0_12px_rgba(245,158,11,0.3)]';
    } else {
      return 'bg-indigo-500/10 text-indigo-600 dark:text-[#A5B4FC] border border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.1)] dark:shadow-[0_0_12px_rgba(99,102,241,0.3)]';
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
      className="group relative flex flex-col justify-between glass-card transition-all"
    >
      <div>
        {/* Top Header Card Info */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <span 
            className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold ${getBadgeStyle(post.score)}`}
          >
            {post.score} Score
          </span>
          
          <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-white/45">
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
        <p className="text-slate-700 dark:text-white/70 text-sm leading-relaxed mb-4 break-words font-medium">
          {truncateText(post.content)}
        </p>
      </div>

      {/* Footer CTA and Deletes */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-3">
        <button
          onClick={onView}
          className="flex items-center text-xs font-bold text-[#6366F1] hover:text-[#8B5CF6] transition-colors cursor-pointer"
        >
          View Analysis
          <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>

        <motion.button
          onClick={onDelete}
          whileHover={{
            color: "#EF4444",
            boxShadow: "0 0 12px rgba(239, 68, 68, 0.2)",
            backgroundColor: "rgba(239, 68, 68, 0.08)"
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 dark:text-white/40 dark:hover:text-red-400 transition-all cursor-pointer"
          title="Delete Analysis"
          aria-label="Delete analysis"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
