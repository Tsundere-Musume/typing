import React, { useContext, useEffect, useRef, useState } from "react";
import { GameState } from "./types/game";
import TypingText from "./components/TypingText";
import { WebsocketContext } from "./components/SocketContext";

const Game: React.FC = () => {
	const [ready, val, sockSend] = useContext(WebsocketContext);
	const [gameState, setGameState] = useState<GameState>({ currentWord: "", currentWordIdx: 0, wordList: [] });
	const gameDiv = useRef<HTMLDivElement>(null);

	useEffect(() => { console.log(val) }, [val])
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (ready) {
				sockSend!(`action:${e.key}`)
			}
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
			wordList: [],
			currentWord: "",
			currentWordIdx: 0,
		})
		const getWords = async () => {
			try {
				const response = await fetch("http://localhost:8000/words");

				if (!response.ok) {
					console.error("Error retrieving data from the server");
				}

				const data = await response.json();
				setGameState(prev => ({
					...prev,
					wordList: data
				}))
			} catch (e) {
				console.error(e);
			}
		}

		getWords();

	}, [])


	return <div className="game" ref={gameDiv} tabIndex={0}>
		{ready && <TypingText {...gameState} />}
	</div>

}

export default Game;
