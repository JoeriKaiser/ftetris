import React from 'react';
import { useGameStore } from '../store/gameStore';
import { TETROMINOES } from '../constants/gameConstants';

const Grid: React.FC = () => {
  const { grid, currentPiece, ghostPiece } = useGameStore();

  const getRotatedShape = (shape: readonly number[][], rotation: number): readonly number[][] => {
    let rotated = [...shape.map(row => [...row])];
    for (let i = 0; i < rotation; i++) {
      const N = rotated.length;
      const newRotated = Array(N).fill(0).map(() => Array(N).fill(0));
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          newRotated[y][x] = rotated[N - 1 - x][y];
        }
      }
      rotated = newRotated;
    }
    return rotated as readonly number[][];
  };

  const renderCell = (cell: number, x: number, y: number) => {
    const piece = TETROMINOES[currentPiece.type];
    const rotatedShape = getRotatedShape(piece.shape as unknown as readonly number[][], currentPiece.rotation);
    
    // check if current piece occupies this cell
    const isCurrent = currentPiece.type && 
      y >= currentPiece.position.y &&
      y < currentPiece.position.y + rotatedShape.length &&
      x >= currentPiece.position.x &&
      x < currentPiece.position.x + rotatedShape[0].length &&
      rotatedShape[y - currentPiece.position.y][x - currentPiece.position.x];
    
    // check if ghost piece occupies this cell
    const isGhost = ghostPiece && 
      y >= ghostPiece.y &&
      y < ghostPiece.y + rotatedShape.length &&
      x >= ghostPiece.x &&
      x < ghostPiece.x + rotatedShape[0].length &&
      rotatedShape[y - ghostPiece.y][x - ghostPiece.x];

    return (
      <div 
        key={`${x}-${y}`} 
        className={`
          w-7 h-7 border border-border/50
          ${cell ? 'bg-secondary' : 'bg-background'}
          ${isCurrent ? 'border-white/50' : ''}
          ${isGhost ? 'border-dashed border-2 opacity-50' : ''}
        `}
        style={{
          backgroundColor: isCurrent ? piece.color : cell ? undefined : undefined,
          borderColor: isGhost ? piece.color : undefined
        }}
      />
    );
  };

  const transposedGrid = Array(grid[0].length).fill(null)
    .map((_, colIndex) => grid.map(row => row[colIndex]));

  return (
    <div className="flex flex-row bg-card p-2 rounded-lg">
      {transposedGrid.map((col, x) => (
        <div key={x} className="flex flex-col">
          {col.map((cell, y) => renderCell(cell, x, y))}
        </div>
      ))}
    </div>
  );
};

export default Grid;