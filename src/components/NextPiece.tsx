import React from 'react';
import { useGameStore } from '../store/gameStore';
import { TETROMINOES } from '../constants/gameConstants';

const NextPiece: React.FC = () => {
  const { nextPiece } = useGameStore();
  const piece = TETROMINOES[nextPiece.type];

  // create a small grid to display the next piece
  const createEmptyGrid = (size: number) => 
    Array(size).fill(null).map(() => Array(size).fill(0));

  const size = Math.max(piece.shape.length, piece.shape[0].length);
  const displayGrid = createEmptyGrid(size);

  // place the piece in the center of the grid
  const offsetY = Math.floor((size - piece.shape.length) / 2);
  const offsetX = Math.floor((size - piece.shape[0].length) / 2);

  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        displayGrid[y + offsetY][x + offsetX] = cell;
      }
    });
  });

  const transposedGrid = Array(displayGrid[0].length).fill(null)
    .map((_, colIndex) => displayGrid.map(row => row[colIndex]));

  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-center mb-3 text-card-foreground">Next Piece</h3>
      <div className="flex flex-row justify-center">
        {transposedGrid.map((col, x) => (
          <div key={x} className="flex flex-col">
            {col.map((cell, y) => (
              <div
                key={`${x}-${y}`}
                className={`w-5 h-5 border border-border/30 ${cell ? 'border-white/10' : ''}`}
                style={{
                  backgroundColor: cell ? piece.color : undefined
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextPiece;