import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Trash2 } from 'lucide-react';

export default function PostCard({ post, onView, onDelete }) {
  
  // Scoring badge style resolver
  const getBadgeStyle = (val) => {
    if (val < 40) {
      return {
        background: "rgba(239, 68, 68, 0.2)",
        color: "#FCA5A5",
        boxShadow: "0 0 12px rgba(239, 68, 68, 0.3)",
        border: "1px solid rgba(239, 68, 68, 0.3)"
      };
    } else if (val < 70) {
      return {
        background: "rgba(245, 158, 11, 0.2)",
        color: "#FCD34D",
        boxShadow: "0 0 12px rgba(245, 158, 11, 0.3)",
        border: "1px solid rgba(245, 158, 11, 0.3)"
      };
    } else {
      return {
        background: "rgba(99, 102, 241, 0.2)",
        color: "#A5B4FC",
        boxShadow: "0 0 12px rgba(99, 102, 241, 0.3)",
        border: "1px solid rgba(99, 102, 241, 0.3)"
      };
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
            className="inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold"
            style={getBadgeStyle(post.score)}
          >
            {post.score} Score
          </span>
          
          <div className="flex items-center space-x-3 text-xs text-white/45">
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
        <p className="text-white/70 text-sm leading-relaxed mb-4 break-words font-medium">
          {truncateText(post.content)}
        </p>
      </div>

      {/* Footer CTA and Deletes */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3">
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
            boxShadow: "0 0 12px rgba(239, 68, 68, 0.3)",
            backgroundColor: "rgba(239, 68, 68, 0.1)"
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-all cursor-pointer"
          title="Delete Analysis"
          aria-label="Delete analysis"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
