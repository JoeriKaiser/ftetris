import React from 'react';
import { useGameStore } from '../store/gameStore';

const ScoreBoard: React.FC = () => {
  const { score, level } = useGameStore();

  return (
    <div className="bg-card p-5 rounded-lg space-y-4">
      <div>
        <h3 className="text-sm font-medium text-card-foreground/60 mb-1">Score</h3>
        <p className="text-2xl font-bold text-card-foreground">{score}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-card-foreground/60 mb-1">Level</h3>
        <p className="text-2xl font-bold text-card-foreground">{level}</p>
      </div>
    </div>
  );
};

export default ScoreBoard; 