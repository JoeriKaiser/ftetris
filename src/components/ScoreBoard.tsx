import React from 'react';
import { motion, useSpring } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const springValue = useSpring(value, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  React.useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return <motion.span>{Math.round(springValue.get())}</motion.span>;
};

const ScoreBoard: React.FC = () => {
  const { score, level } = useGameStore();

  return (
    <div className="bg-card p-5 rounded-lg space-y-4">
      <div>
        <h3 className="text-sm font-medium text-card-foreground/60 mb-1">Score</h3>
        <motion.p
          className="text-2xl font-bold text-card-foreground"
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AnimatedNumber value={score} />
        </motion.p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-card-foreground/60 mb-1">Level</h3>
        <motion.p
          className="text-2xl font-bold text-card-foreground"
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AnimatedNumber value={level} />
        </motion.p>
      </div>
    </div>
  );
};

export default ScoreBoard; 