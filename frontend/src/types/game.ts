export type Player = {
	id: string;
	name?: string;
	pos: [number, number];
	currentWord: string;
}

export type GameState = {
	gameId: string;
	wordList: string[];
	players: {[key: string]: Player};

	// Current Player
	currentPlayerId: string;
	// currentWord: string;
	// currentWordIdx: number;
}
