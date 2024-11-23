import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import Grid from './Grid';
import NextPiece from './NextPiece';
import ScoreBoard from './ScoreBoard';
import { ThemeToggle } from './ThemeToggle';

const Game: React.FC = () => {
  const { 
    startGame, 
    moveLeft, 
    moveRight, 
    moveDown, 
    rotate, 
    hardDrop,
    isGameOver,
    gameInterval
  } = useGameStore();

  useEffect(() => {
    startGame();
    return () => {
      if (gameInterval) {
        clearInterval(gameInterval);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return;

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
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameOver, moveLeft, moveRight, moveDown, rotate, hardDrop]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
        <Grid />
        <div className="flex flex-row md:flex-col gap-4">
          <NextPiece />
          <ScoreBoard />
          <ThemeToggle />
        </div>
      </div>
      {isGameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-card p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">Game Over!</h2>
            <button 
              onClick={startGame}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game; 