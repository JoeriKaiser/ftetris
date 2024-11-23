import { create } from 'zustand';
import { GameState, TetrominoType, Position, Tetromino } from '../types/types';
import { GRID_WIDTH, GRID_HEIGHT, TETROMINOES, POINTS_PER_LINE, LINES_PER_LEVEL, INITIAL_SPEED } from '../constants/gameConstants';

const isWithinBounds = (x: number, y: number): boolean => {
  return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
};

const hasCollision = (
  grid: number[][],
  piece: Tetromino,
  position: Position = piece.position
): boolean => {
  let shape = [...TETROMINOES[piece.type].shape.map(row => [...row] as (0 | 1)[])];
  for (let i = 0; i < piece.rotation; i++) {
    shape = rotateMatrix(shape) as (0 | 1)[][];
  }

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = x + position.x;
        const newY = y + position.y;

        if (
          !isWithinBounds(newX, newY) ||
          (newY >= 0 && grid[newY][newX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

const createEmptyGrid = () =>
  Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0));

const getRandomTetromino = () => {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    type,
    position: {
      x: Math.floor(GRID_WIDTH / 2) - Math.floor(TETROMINOES[type].shape[0].length / 2),
      y: 0
    },
    rotation: 0,
  };
};

const rotateMatrix = (matrix: readonly number[][]): readonly number[][] => {
  const N = matrix.length;
  const rotated = Array(N).fill(0).map(() => Array(N).fill(0));
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      rotated[y][x] = matrix[N - 1 - x][y];
    }
  }
  return rotated as readonly number[][];
};

const clearLines = (grid: number[][]): { newGrid: number[][], linesCleared: number } => {
  let linesCleared = 0;
  const newGrid = grid.reduce((acc, row) => {
    if (row.every(cell => cell === 1)) {
      linesCleared++;
      acc.unshift(Array(GRID_WIDTH).fill(0));
    } else {
      acc.push(row);
    }
    return acc;
  }, [] as number[][]);

  return { newGrid, linesCleared };
};

// wall kick data (SRS - Super Rotation System)
const WALL_KICK_DATA = {
  'JLSTZ': [
    [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], // 0->1
    [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],     // 1->2
    [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],    // 2->3
    [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],  // 3->0
  ],
  'I': [
    [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],   // 0->1
    [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],   // 1->2
    [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],   // 2->3
    [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],   // 3->0
  ],
} as const;

const getGhostPosition = (grid: number[][], piece: Tetromino): Position => {
  const ghostPosition = { ...piece.position };

  while (!hasCollision(grid, { ...piece, position: { ...ghostPosition, y: ghostPosition.y + 1 } })) {
    ghostPosition.y++;
  }

  return ghostPosition;
};

const tryWallKick = (
  grid: number[][],
  piece: Tetromino,
  newRotation: number
): Position | null => {
  const kicks = WALL_KICK_DATA[piece.type === 'I' ? 'I' : 'JLSTZ'][piece.rotation];

  for (const [offsetX, offsetY] of kicks) {
    const newPosition = {
      x: piece.position.x + offsetX,
      y: piece.position.y + offsetY
    };

    if (!hasCollision(grid, { ...piece, position: newPosition, rotation: newRotation })) {
      return newPosition;
    }
  }

  return null;
};

const lockPiece = (grid: number[][], piece: Tetromino): number[][] => {
  const newGrid = grid.map(row => [...row]);
  let shape = [...TETROMINOES[piece.type].shape.map(row => [...row] as (0 | 1)[])];

  for (let i = 0; i < piece.rotation; i++) {
    shape = rotateMatrix(shape) as number[][] as (0 | 1)[][];
  }

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const pieceX = x + piece.position.x;
        const pieceY = y + piece.position.y;
        if (pieceY >= 0 && pieceY < GRID_HEIGHT && pieceX >= 0 && pieceX < GRID_WIDTH) {
          newGrid[pieceY][pieceX] = 1;
        }
      }
    }
  }

  return newGrid;
};

interface GameStore extends GameState {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotate: () => void;
  hardDrop: () => void;
  startGame: () => void;
  tick: () => void;
  ghostPiece: Position | null;
  gameInterval: NodeJS.Timeout | null;
  isPaused: boolean;
  pauseGame: () => void;
  resumeGame: () => void;
}

export const useGameStore = create<GameStore>()((set, get) => ({
  grid: createEmptyGrid(),
  currentPiece: getRandomTetromino(),
  nextPiece: getRandomTetromino(),
  score: 0,
  level: 1,
  isGameOver: false,
  ghostPiece: null,
  gameInterval: null,
  isPaused: false,

  moveLeft: () => {
    const { currentPiece, grid } = get();
    const newPosition = {
      ...currentPiece.position,
      x: currentPiece.position.x - 1
    };

    if (!hasCollision(grid, { ...currentPiece, position: newPosition })) {
      set({
        currentPiece: { ...currentPiece, position: newPosition },
        ghostPiece: getGhostPosition(grid, { ...currentPiece, position: newPosition })
      });
    }
  },

  moveRight: () => {
    const { currentPiece, grid } = get();
    const newPosition = {
      ...currentPiece.position,
      x: currentPiece.position.x + 1
    };

    if (!hasCollision(grid, { ...currentPiece, position: newPosition })) {
      set({
        currentPiece: { ...currentPiece, position: newPosition },
        ghostPiece: getGhostPosition(grid, { ...currentPiece, position: newPosition })
      });
    }
  },

  moveDown: () => {
    const { currentPiece, grid, nextPiece, score, level } = get();
    const newPosition = {
      ...currentPiece.position,
      y: currentPiece.position.y + 1
    };

    if (!hasCollision(grid, { ...currentPiece, position: newPosition })) {
      set({
        currentPiece: { ...currentPiece, position: newPosition },
        ghostPiece: getGhostPosition(grid, { ...currentPiece, position: newPosition })
      });
    } else {
      const newGrid = lockPiece(grid, currentPiece);

      if (currentPiece.position.y <= 0) {
        const { gameInterval } = get();
        if (gameInterval) clearInterval(gameInterval);
        set({ isGameOver: true });
        return;
      }

      const { newGrid: clearedGrid, linesCleared } = clearLines(newGrid);
      const newScore = score + (linesCleared * POINTS_PER_LINE * level);
      const newLevel = Math.floor(newScore / (POINTS_PER_LINE * LINES_PER_LEVEL)) + 1;

      const nextRandomPiece = getRandomTetromino();
      set({
        grid: clearedGrid,
        currentPiece: nextPiece,
        nextPiece: nextRandomPiece,
        score: newScore,
        level: newLevel,
        ghostPiece: getGhostPosition(clearedGrid, nextPiece)
      });
    }
  },

  hardDrop: () => {
    const { currentPiece, grid } = get();
    const newPosition = { ...currentPiece.position };

    while (!hasCollision(grid, { ...currentPiece, position: { ...newPosition, y: newPosition.y + 1 } })) {
      newPosition.y++;
    }

    set({ currentPiece: { ...currentPiece, position: newPosition } });
    get().moveDown();
  },

  startGame: () => {
    const { gameInterval } = get();
    if (gameInterval) clearInterval(gameInterval);

    const newPiece = getRandomTetromino();
    const emptyGrid = createEmptyGrid();

    const newInterval = setInterval(() => {
      const { isGameOver, isPaused } = get();
      if (!isGameOver && !isPaused) {
        get().tick();
      } else if (isGameOver) {
        clearInterval(newInterval);
      }
    }, INITIAL_SPEED);

    set({
      grid: emptyGrid,
      currentPiece: newPiece,
      nextPiece: getRandomTetromino(),
      score: 0,
      level: 1,
      isGameOver: false,
      isPaused: false,
      ghostPiece: getGhostPosition(emptyGrid, newPiece),
      gameInterval: newInterval
    });
  },

  tick: () => {
    get().moveDown();
  },

  rotate: () => {
    const { currentPiece, grid } = get();
    const newRotation = (currentPiece.rotation + 1) % 4;

    if (!hasCollision(grid, { ...currentPiece, rotation: newRotation })) {
      set({
        currentPiece: {
          ...currentPiece,
          rotation: newRotation
        },
        ghostPiece: getGhostPosition(grid, { ...currentPiece, rotation: newRotation })
      });
      return;
    }

    const kickedPosition = tryWallKick(grid, currentPiece, newRotation);
    if (kickedPosition) {
      set({
        currentPiece: {
          ...currentPiece,
          position: kickedPosition,
          rotation: newRotation
        },
        ghostPiece: getGhostPosition(grid, {
          ...currentPiece,
          position: kickedPosition,
          rotation: newRotation
        })
      });
    }
  },

  pauseGame: () => {
    const { gameInterval } = get();
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    set({ gameInterval: null, isPaused: true });
  },

  resumeGame: () => {
    const { isPaused } = get();
    if (!isPaused) return;

    const newInterval = setInterval(() => {
      const { isGameOver, isPaused } = get();
      if (!isGameOver && !isPaused) {
        get().tick();
      } else if (isGameOver) {
        clearInterval(newInterval);
      }
    }, INITIAL_SPEED);

    set({ gameInterval: newInterval, isPaused: false });
  },
})); 