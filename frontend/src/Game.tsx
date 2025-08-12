import React, { useEffect, useState } from "react";
import { GameState } from "./types/game";
import TypingText from "./components/TypingText";


const Game: React.FC = () => {
	const [gameState, setGameState] = useState<GameState>({ currentWord: "", currentWordIdx: 0 });

	useEffect(() => {
		setGameState({
			wordList: ["hello", "world"],
			currentWord: "hell",
			currentWordIdx: 0,
		})
	}, [])

	return <>
		<TypingText {...gameState} />
	</>

}

export default Game;
