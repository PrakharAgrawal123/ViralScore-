import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScoreRing({ score = 0, size = 160 }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate the count up on mount
  useEffect(() => {
    let start = 0;
    const end = parseInt(score);
    if (end === 0) return;
    
    const duration = 1000; // 1 second
    const incrementTime = Math.floor(duration / end);
    
    const timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);

  // Styling and colors based on score range
  const getColorClasses = (val) => {
    if (val < 40) {
      return {
        stroke: '#EF4444',
        bgStroke: 'stroke-red-100 dark:stroke-red-950/20',
        text: 'text-red-600 dark:text-red-400',
        glow: 'glow-red',
        bgBadge: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400',
        label: 'Needs Work'
      };
    } else if (val < 70) {
      return {
        stroke: '#F59E0B',
        bgStroke: 'stroke-amber-100 dark:stroke-amber-950/20',
        text: 'text-amber-600 dark:text-amber-400',
        glow: 'glow-amber',
        bgBadge: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
        label: 'Average'
      };
    } else {
      return {
        stroke: '#22C55E',
        bgStroke: 'stroke-emerald-100 dark:stroke-emerald-950/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        glow: 'glow-green',
        bgBadge: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
        label: 'Viral Potential'
      };
    }
  };

  const colors = getColorClasses(score);
  
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative flex items-center justify-center p-3 rounded-full bg-white dark:bg-slate-900 shadow-md ${colors.glow} transition-shadow duration-500`}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Base circle background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${colors.bgStroke} fill-transparent`}
            strokeWidth={strokeWidth}
          />
          {/* Animated score circle fill */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-transparent"
            strokeWidth={strokeWidth}
            stroke={colors.stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Count-up Score text inside circle */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${colors.text}`}>
            {displayScore}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
            out of 100
          </span>
        </div>
      </div>
      
      {/* Category status badge below circular SVG */}
      <span className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors.bgBadge}`}>
        {colors.label}
      </span>
    </div>
  );
}
