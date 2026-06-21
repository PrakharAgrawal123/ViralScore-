import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({ title, value, subtext, icon: Icon, trend }) {
  const numericValue = parseInt(value) || 0;
  const isBenchmark = typeof value === 'string' && value.includes('/');
  
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, numericValue, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });
    return () => controls.stop();
  }, [numericValue, count]);

  const getAccent = (title) => {
    if (title.toLowerCase().includes("analysed")) {
      return { rgb: "99, 102, 241" }; // Indigo
    }
    if (title.toLowerCase().includes("average")) {
      return { rgb: "139, 92, 246" }; // Violet
    }
    if (title.toLowerCase().includes("best")) {
      return { rgb: "16, 185, 129" }; // Emerald
    }
    return { rgb: "245, 158, 11" }; // Amber
  };

  const accent = getAccent(title);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden glass-card transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          {/* Label */}
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
            {title}
          </p>
          {/* Main Stat Score */}
          <h3 className="mt-2 text-[32px] font-bold tracking-tight text-white">
            {isBenchmark ? `${displayValue}/100` : displayValue}
          </h3>
        </div>
        
        {/* Dynamic Icon with Accent Styles */}
        <div 
          className="flex h-12 w-12 items-center justify-center rounded-xl transition-all"
          style={{
            background: `rgba(${accent.rgb}, 0.15)`,
            color: `rgb(${accent.rgb})`,
            boxShadow: `0 0 20px rgba(${accent.rgb}, 0.2)`
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Subtitle / Trend Badge */}
      <div className="mt-4 flex items-center space-x-1.5">
        {trend && (
          <span 
            className="inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold"
            style={trend.type === 'positive' ? {
              background: "rgba(16, 185, 129, 0.15)",
              color: "#6EE7B7"
            } : {
              background: "rgba(239, 68, 68, 0.15)",
              color: "#FCA5A5"
            }}
          >
            {trend.type === 'positive' ? (
              <ArrowUpRight className="mr-0.5 h-3 w-3" />
            ) : (
              <ArrowDownRight className="mr-0.5 h-3 w-3" />
            )}
            {trend.value}
          </span>
        )}
        <span className="text-xs text-white/40 font-medium">
          {subtext}
        </span>
      </div>
    </motion.div>
  );
}
