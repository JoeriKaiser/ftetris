import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import Grid from './Grid';
import NextPiece from './NextPiece';
import ScoreBoard from './ScoreBoard';
import { ThemeToggle } from './ThemeToggle';
import { AnimatePresence } from 'framer-motion';
import { Pause, Play, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const Game: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const {
    startGame,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    isGameOver,
    isPaused,
    pauseGame,
    resumeGame,
    gameInterval
  } = useGameStore();

  useEffect(() => {
    return () => {
      if (gameInterval) {
        clearInterval(gameInterval);
      }
    };
  }, [gameInterval]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver || isPaused || !isStarted) return;

      switch (e.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotate();
          break;
        case ' ':
          hardDrop();
          break;
        case 'p':
          pauseGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameOver, isPaused, isStarted, moveLeft, moveRight, moveDown, rotate, hardDrop, pauseGame]);

  const handleStart = () => {
    setIsStarted(true);
    startGame();
  };

  const handleRestart = () => {
    startGame();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
        <div className="flex flex-col gap-4">
          <Grid />
        </div>
        <div className="flex flex-row md:flex-col gap-4">
          <div className="flex gap-2 justify-center w-[240px]">
            <AnimatePresence mode="wait">
              {!isStarted ? (
                <motion.button
                  key="start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={handleStart}
                  className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-2 justify-center" // Added w-full and justify-center
                >
                  <Play size={18} />
                  Start Game
                </motion.button>
              ) : (
                <>
                  <motion.button
                    key="pause"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={handlePauseResume}
                    className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-2 justify-center" // Added flex-1 and justify-center
                  >
                    {isPaused ? <Play size={18} /> : <Pause size={18} />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </motion.button>
                  <motion.button
                    key="restart"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={handleRestart}
                    className="flex-1 px-6 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors inline-flex items-center gap-2 justify-center" // Added flex-1 and justify-center
                  >
                    <RefreshCw size={18} />
                    Restart
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
          <ThemeToggle />
          <NextPiece />
          <ScoreBoard />
        </div>
      </div>
      {isGameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-card p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">Game Over!</h2>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      {isPaused && !isGameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-card p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">Game Paused</h2>
            <button
              onClick={handlePauseResume}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game; 