export type Position = {
  x: number;
  y: number;
};

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Tetromino = {
  type: TetrominoType;
  position: Position;
  rotation: number;
};

export type GameState = {
  grid: number[][];
  currentPiece: Tetromino;
  nextPiece: Tetromino;
  score: number;
  level: number;
  isGameOver: boolean;
}; 