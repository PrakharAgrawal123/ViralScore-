import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({ title, value, subtext, icon: Icon, trend }) {
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          {/* Label */}
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          {/* Main Stat Score */}
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
        
        {/* Dynamic Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Subtitle / Trend Badge */}
      <div className="mt-4 flex items-center space-x-1.5">
        {trend && (
          <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-bold ${
            trend.type === 'positive' 
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
              : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
          }`}>
            {trend.type === 'positive' ? (
              <ArrowUpRight className="mr-0.5 h-3 w-3" />
            ) : (
              <ArrowDownRight className="mr-0.5 h-3 w-3" />
            )}
            {trend.value}
          </span>
        )}
        <span className="text-xs text-slate-500 font-medium">
          {subtext}
        </span>
      </div>
    </motion.div>
  );
}
