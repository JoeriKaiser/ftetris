import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RefreshCw } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import Grid from "./Grid";
import NextPiece from "./NextPiece";
import ScoreBoard from "./ScoreBoard";
import { ThemeToggle } from "./ThemeToggle";

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
		gameInterval,
	} = useGameStore();

	const handleStart = useCallback(() => {
		setIsStarted(true);
		startGame();
	}, [startGame]);

	const handleRestart = useCallback(() => {
		startGame();
	}, [startGame]);

	const handlePauseResume = useCallback(() => {
		isPaused ? resumeGame() : pauseGame();
	}, [isPaused, resumeGame, pauseGame]);

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

			const keyMap: Record<string, () => void> = {
				ArrowLeft: moveLeft,
				ArrowRight: moveRight,
				ArrowDown: moveDown,
				ArrowUp: rotate,
				" ": hardDrop,
				p: pauseGame,
			};

			keyMap[e.key]?.();
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [
		isGameOver,
		isPaused,
		isStarted,
		moveLeft,
		moveRight,
		moveDown,
		rotate,
		hardDrop,
		pauseGame,
	]);

	const buttonVariants = {
		initial: { opacity: 0, x: -20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: 20 },
	};

	const buttonClasses =
		"px-6 py-2 rounded-md transition-colors inline-flex items-center gap-2 justify-center";

	const Modal = ({
		isOpen,
		title,
		onAction,
		actionText,
	}: {
		isOpen: boolean;
		title: string;
		onAction: () => void;
		actionText: string;
	}) =>
		isOpen && (
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
				<div className="bg-card p-8 rounded-lg shadow-lg text-center">
					<h2 className="text-2xl font-bold mb-4 text-card-foreground">
						{title}
					</h2>
					<button
						type="button"
						onClick={onAction}
						className={`${buttonClasses} bg-primary text-primary-foreground hover:bg-primary/90`}
					>
						{actionText}
					</button>
				</div>
			</div>
		);

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
									variants={buttonVariants}
									initial="initial"
									animate="animate"
									exit="exit"
									onClick={handleStart}
									className={`w-full ${buttonClasses} bg-primary text-primary-foreground hover:bg-primary/90`}
								>
									<Play size={18} />
									Start Game
								</motion.button>
							) : (
								<>
									<motion.button
										key="pause"
										variants={buttonVariants}
										initial="initial"
										animate="animate"
										exit="exit"
										onClick={handlePauseResume}
										className={`flex-1 ${buttonClasses} bg-primary text-primary-foreground hover:bg-primary/90`}
									>
										{isPaused ? <Play size={18} /> : <Pause size={18} />}
										{isPaused ? "Resume" : "Pause"}
									</motion.button>
									<motion.button
										key="restart"
										variants={buttonVariants}
										initial="initial"
										animate="animate"
										exit="exit"
										onClick={handleRestart}
										className={`flex-1 ${buttonClasses} bg-destructive text-destructive-foreground hover:bg-destructive/90`}
									>
										<RefreshCw size={18} />
										Restart
									</motion.button>
								</>
							)}
						</AnimatePresence>
					</div>
					<NextPiece />
					<ScoreBoard />
					<div className="bottom-0">
						<ThemeToggle />
					</div>
				</div>
			</div>

			<Modal
				isOpen={isGameOver}
				title="Game Over!"
				onAction={handleRestart}
				actionText="Play Again"
			/>

			<Modal
				isOpen={isPaused && !isGameOver}
				title="Game Paused"
				onAction={handlePauseResume}
				actionText="Resume"
			/>
		</div>
	);
};

export default Game;
