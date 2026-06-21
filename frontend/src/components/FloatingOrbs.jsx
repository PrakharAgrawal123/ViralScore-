import { motion } from 'framer-motion';

const orbs = [
  { size: 600, x: "-10%", y: "-20%", color: "#6366F1", delay: 0, duration: 12 },
  { size: 500, x: "60%",  y: "30%",  color: "#8B5CF6", delay: 2, duration: 14 },
  { size: 400, x: "20%",  y: "70%",  color: "#EC4899", delay: 4, duration: 10 },
];

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 min-h-screen w-full">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(120px)",
            opacity: 0.12,
            zIndex: 0,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
