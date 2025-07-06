import type React from "react";
import { useMemo } from "react";

import { TETROMINOES } from "../constants/gameConstants";
import { useGameStore } from "../store/gameStore";

const Grid: React.FC = () => {
	const { grid, currentPiece, ghostPiece } = useGameStore();

	const rotatedShape = useMemo(() => {
		if (!currentPiece?.type) return [];

		const shape = TETROMINOES[currentPiece.type].shape;
		let rotated = shape.map((row) => [...row]);

		for (let i = 0; i < currentPiece.rotation; i++) {
			const n = rotated.length;
			const newRotated = Array(n)
				.fill(0)
				.map(() => Array(n).fill(0));

			for (let y = 0; y < n; y++) {
				for (let x = 0; x < n; x++) {
					newRotated[y][x] = rotated[n - 1 - x][y];
				}
			}
			rotated = newRotated;
		}

		return rotated;
	}, [currentPiece?.type, currentPiece?.rotation]);

	const transposedGrid = useMemo(
		() =>
			Array(grid[0]?.length || 0)
				.fill(null)
				.map((_, colIndex) => grid.map((row) => row[colIndex])),
		[grid],
	);

	const renderCell = (cell: number, x: number, y: number) => {
		if (!currentPiece?.type) {
			return (
				<div
					key={`${x}-${y}`}
					className={`w-7 h-7 border border-border/50 ${
						cell ? "bg-secondary" : "bg-background"
					}`}
				/>
			);
		}

		const piece = TETROMINOES[currentPiece.type];
		const { position } = currentPiece;

		const isCurrent =
			y >= position.y &&
			y < position.y + rotatedShape.length &&
			x >= position.x &&
			x < position.x + rotatedShape[0].length &&
			rotatedShape[y - position.y][x - position.x];

		const isGhost =
			ghostPiece &&
			y >= ghostPiece.y &&
			y < ghostPiece.y + rotatedShape.length &&
			x >= ghostPiece.x &&
			x < ghostPiece.x + rotatedShape[0].length &&
			rotatedShape[y - ghostPiece.y][x - ghostPiece.x];

		return (
			<div
				key={`${x}-${y}`}
				className={`w-7 h-7 border border-border/50 ${
					cell ? "bg-secondary" : "bg-background"
				} ${isCurrent ? "border-white/50" : ""} ${
					isGhost ? "border-dashed border-2 opacity-50" : ""
				}`}
				style={{
					backgroundColor: isCurrent ? piece.color : undefined,
					borderColor: isGhost ? piece.color : undefined,
				}}
			/>
		);
	};

	return (
		<div className="flex flex-row bg-card p-2 rounded-lg">
			{transposedGrid.map((col, x) => (
				<div key={`${x}-${col.length}`} className="flex flex-col">
					{col.map((cell, y) => renderCell(cell, x, y))}
				</div>
			))}
		</div>
	);
};

export default Grid;
