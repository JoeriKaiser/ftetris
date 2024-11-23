import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGameStore } from './gameStore';
import { GRID_WIDTH, GRID_HEIGHT, INITIAL_SPEED } from '../constants/gameConstants';

describe('gameStore', () => {
  beforeEach(() => {
    const store = useGameStore.getState();
    store.startGame();
    vi.clearAllMocks();
  });

  afterEach(() => {
    const store = useGameStore.getState();
    if (store.gameInterval) {
      clearInterval(store.gameInterval);
    }
  });

  describe('Initial state', () => {
    it('should initialize with correct default values', () => {
      const store = useGameStore.getState();
      expect(store.score).toBe(0);
      expect(store.level).toBe(1);
      expect(store.isGameOver).toBe(false);
      expect(store.isPaused).toBe(false);
      expect(store.grid.length).toBe(GRID_HEIGHT);
      expect(store.grid[0].length).toBe(GRID_WIDTH);
      expect(store.currentPiece).toBeDefined();
      expect(store.nextPiece).toBeDefined();
    });
  });

  describe('Movement controls', () => {
    it('should move piece left when there is space', () => {
      const store = useGameStore.getState();
      const initialX = store.currentPiece.position.x;
      store.moveLeft();
      expect(store.currentPiece.position.x).toBe(initialX - 1);
    });

    it('should move piece right when there is space', () => {
      const store = useGameStore.getState();
      const initialX = store.currentPiece.position.x;
      store.moveRight();
      expect(store.currentPiece.position.x).toBe(initialX + 1);
    });

    it('should move piece down when there is space', () => {
      const store = useGameStore.getState();
      const initialY = store.currentPiece.position.y;
      store.moveDown();
      expect(store.currentPiece.position.y).toBe(initialY + 1);
    });

    it('should not move piece left at grid boundary', () => {
      const store = useGameStore.getState();
      while (store.currentPiece.position.x > 0) {
        store.moveLeft();
      }
      const atBoundaryX = store.currentPiece.position.x;
      store.moveLeft();
      expect(store.currentPiece.position.x).toBe(atBoundaryX);
    });
  });

  describe('Rotation', () => {
    it('should rotate piece when space is available', () => {
      const store = useGameStore.getState();
      const initialRotation = store.currentPiece.rotation;
      store.rotate();
      expect(store.currentPiece.rotation).toBe((initialRotation + 1) % 4);
    });
  });

  describe('Game controls', () => {
    it('should pause and resume the game', () => {
      const store = useGameStore.getState();

      store.pauseGame();
      expect(store.isPaused).toBe(true);
      expect(store.gameInterval).toBeNull();

      store.resumeGame();
      expect(store.isPaused).toBe(false);
      expect(store.gameInterval).toBeDefined();
    });

    it('should handle hard drop', () => {
      const store = useGameStore.getState();
      const initialY = store.currentPiece.position.y;
      store.hardDrop();
      expect(store.currentPiece.position.y).toBeGreaterThan(initialY);
    });

    it('should start a new game with reset values', () => {
      const store = useGameStore.getState();
      store.score = 1000;
      store.level = 5;
      store.isGameOver = true;

      store.startGame();

      expect(store.score).toBe(0);
      expect(store.level).toBe(1);
      expect(store.isGameOver).toBe(false);
      expect(store.isPaused).toBe(false);
    });
  });

  describe('Game mechanics', () => {
    it('should update score when clearing lines', () => {
      const store = useGameStore.getState();
      const initialScore = store.score;

      store.grid = store.grid.map((row, idx) =>
        idx === GRID_HEIGHT - 1 ? Array(GRID_WIDTH).fill(1) : row
      );

      store.hardDrop();

      expect(store.score).toBeGreaterThan(initialScore);
    });

    it('should handle game over condition', () => {
      const store = useGameStore.getState();

      store.grid = store.grid.map(() => Array(GRID_WIDTH).fill(1));

      store.moveDown();

      expect(store.isGameOver).toBe(true);
    });

    it('should update ghost piece position', () => {
      const store = useGameStore.getState();
      expect(store.ghostPiece).toBeDefined();
      expect(store.ghostPiece!.y).toBeGreaterThanOrEqual(store.currentPiece.position.y);
    });
  });

  describe('Game intervals', () => {
    it('should create game interval on start', () => {
      vi.useFakeTimers();
      const store = useGameStore.getState();

      store.startGame();
      expect(store.gameInterval).toBeDefined();

      vi.advanceTimersByTime(INITIAL_SPEED);
      expect(store.currentPiece.position.y).toBeGreaterThan(0);

      vi.useRealTimers();
    });

    it('should clear interval on game over', () => {
      const store = useGameStore.getState();
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

      store.grid = store.grid.map(() => Array(GRID_WIDTH).fill(1));
      store.moveDown();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});