export type Player = {
	id: string;
	name?: string;
	pos: [number, number];
	currentWord: string;
}

export type GameState = {
	// gameId: string;
	wordList: string[];
	// Current Player
	currentWord: string;
	currentWordIdx: number;

	players: object
}
