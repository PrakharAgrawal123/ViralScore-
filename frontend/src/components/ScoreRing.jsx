import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

export default function ScoreRing({ score = 0, size = 160 }) {
  const [displayScore, setDisplayScore] = useState(0);
  const count = useMotionValue(0);

  // Animate the count up on mount/change
  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayScore(Math.round(latest))
    });
    return () => controls.stop();
  }, [score, count]);

  // Styling and colors based on score range
  const getColorClasses = (val) => {
    if (val < 40) {
      return {
        gradientId: 'grad-red',
        text: 'text-red-505',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
        bgBadge: 'bg-red-500/10 text-red-400 border border-red-500/20',
        label: 'Needs Work'
      };
    } else if (val < 70) {
      return {
        gradientId: 'grad-amber',
        text: 'text-amber-505',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
        bgBadge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        label: 'Average'
      };
    } else {
      return {
        gradientId: 'grad-green',
        text: 'text-[#A5B4FC]',
        glow: 'shadow-[0_0_20px_rgba(99,102,241,0.2)]',
        bgBadge: 'bg-[#6366F1]/10 text-[#A5B4FC] border border-[#6366F1]/20',
        label: 'Viral Potential'
      };
    }
  };

  const colors = getColorClasses(score);
  
  const strokeWidth = 12;
  // Reduce radius slightly to fit pulsed and rotating outer rings within the size bounds
  const radius = (size - strokeWidth - 24) / 2; 
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const strokeColor = `url(#${colors.gradientId})`;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative flex items-center justify-center p-3 rounded-full bg-slate-950/40 border border-white/5 ${colors.glow} transition-shadow duration-500`}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Rotating dashed outer ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius + strokeWidth + 6}
            className="fill-transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1}
            strokeDasharray="4 8"
            style={{ transformOrigin: "center" }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Pulsing outer glow ring when score > 70 */}
          {score >= 70 && (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              className="fill-transparent"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              animate={{
                r: [radius, radius + 8, radius],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {/* Base circle background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-white/5 fill-transparent"
            strokeWidth={strokeWidth}
          />
          {/* Animated score circle fill */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-transparent"
            strokeWidth={strokeWidth}
            stroke={strokeColor}
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
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/30">
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
