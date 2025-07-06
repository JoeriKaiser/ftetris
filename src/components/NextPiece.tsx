import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { TETROMINOES } from "../constants/gameConstants";
import { useGameStore } from "../store/gameStore";

const NextPiece: React.FC = () => {
	const { nextPiece } = useGameStore();
	const piece = TETROMINOES[nextPiece.type];

	// Transpose the piece shape to maintain consistent orientation
	const transposedShape = piece.shape[0].map((_, colIndex) =>
		piece.shape.map((row) => row[colIndex]),
	);

	return (
		<div className="bg-card p-4 rounded-lg">
			<h3 className="text-lg font-semibold text-center mb-3 text-card-foreground">
				Next Piece
			</h3>
			<div className="h-24 relative">
				<AnimatePresence mode="popLayout">
					<motion.div
						key={nextPiece.type}
						className="flex flex-row justify-center absolute w-full"
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -50, opacity: 0 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 25,
						}}
					>
						{transposedShape.map((col, x) => (
							<div key={`${x}-${col.length}`} className="flex flex-col">
								{col.map((cell, y) => (
									<div
										key={`${x}-${y.toString()}`}
										className={`w-5 h-5 ${cell ? "" : "invisible"}`}
										style={{
											backgroundColor: cell ? piece.color : undefined,
										}}
									/>
								))}
							</div>
						))}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};

export default NextPiece;
