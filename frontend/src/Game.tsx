import React, { useEffect, useRef, useState } from "react";
import { GameState } from "./types/game";
import TypingText from "./components/TypingText";

const Game: React.FC = () => {
	const [gameState, setGameState] = useState<GameState>({ currentWord: "", currentWordIdx: 0, wordList: [] });
	const gameDiv = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key == ' ') {
				e.preventDefault();
			}

			setGameState(prev => {
				const correct = prev.wordList[prev.currentWordIdx] == prev.currentWord;
				if (correct && e.key === ' ') {
					return {
						...prev,
						currentWord: "",
						currentWordIdx: prev.currentWordIdx + 1,
					}
				} else { return prev; }
			})

			if (e.key == "Backspace") {
				setGameState(prev => ({
					...prev,
					currentWord: prev.currentWord.slice(0, prev.currentWord.length - 1),
				}));
			}

			if (e.key.length === 1) {
				const c = e.key.charCodeAt(0);
				if (c > 32 && c < 127) {
					setGameState(prev => ({
						...prev,
						currentWord: prev.currentWord.concat(e.key),
					}));
				}
			}
			console.log('keydown', e.key)
		}

		gameDiv.current?.addEventListener('keydown', handleKeyPress)
		gameDiv.current?.focus()

		return () => {
			gameDiv.current?.removeEventListener('keydown', handleKeyPress)
		}
	}, [])

	useEffect(() => {
		setGameState({
			wordList: ["hello", "world", "these", "are", "some", "words"],
			currentWord: "hell",
			currentWordIdx: 0,
		})
	}, [])




	return <div className="game" ref={gameDiv} tabIndex={0}>
		<TypingText {...gameState} />
	</div>

}

export default Game;
