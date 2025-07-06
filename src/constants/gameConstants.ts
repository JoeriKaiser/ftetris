export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;
export const INITIAL_SPEED = 1000;
export const SPEED_INCREASE = 0.85;
export const POINTS_PER_LINE = 100;
export const LINES_PER_LEVEL = 10;

export const TETROMINOES = {
	I: {
		shape: [
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		color: "#00f0f0",
	},
	O: {
		shape: [
			[1, 1],
			[1, 1],
		],
		color: "#f0f000",
	},
	T: {
		shape: [
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0],
		],
		color: "#a000f0",
	},
	S: {
		shape: [
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0],
		],
		color: "#00f000",
	},
	Z: {
		shape: [
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0],
		],
		color: "#f00000",
	},
	J: {
		shape: [
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0],
		],
		color: "#0000f0",
	},
	L: {
		shape: [
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0],
		],
		color: "#f0a000",
	},
} as const;

export const WALL_KICK_DATA = {
	JLSTZ: [
		[
			[0, 0],
			[-1, 0],
			[-1, 1],
			[0, -2],
			[-1, -2],
		],
		[
			[0, 0],
			[1, 0],
			[1, -1],
			[0, 2],
			[1, 2],
		],
		[
			[0, 0],
			[1, 0],
			[1, 1],
			[0, -2],
			[1, -2],
		],
		[
			[0, 0],
			[-1, 0],
			[-1, -1],
			[0, 2],
			[-1, 2],
		],
	],
	I: [
		[
			[0, 0],
			[-2, 0],
			[1, 0],
			[-2, -1],
			[1, 2],
		],
		[
			[0, 0],
			[-1, 0],
			[2, 0],
			[-1, 2],
			[2, -1],
		],
		[
			[0, 0],
			[2, 0],
			[-1, 0],
			[2, 1],
			[-1, -2],
		],
		[
			[0, 0],
			[1, 0],
			[-2, 0],
			[1, -2],
			[-2, 1],
		],
	],
} as const;

export type TetrominoShape =
	(typeof TETROMINOES)[keyof typeof TETROMINOES]["shape"];
