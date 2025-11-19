import React, { useContext, useEffect, useRef, useState } from "react";
import { GameState } from "./types/game";
import TypingText from "./components/TypingText";
import { WebsocketContext } from "./components/SocketContext";
import { SessionContext } from "./components/SessionContext";

const Game: React.FC = () => {
	const [socketReady, msg, sockSend] = useContext(WebsocketContext);
	const { sessionReady, sessionData } = useContext(SessionContext);
	const [gameState, setGameState] = useState<GameState>({} as GameState);
	const gameDiv = useRef<HTMLDivElement>(null);
	let [ready, setReady] = useState(false);

	useEffect(() => {
		if (msg && sessionReady) {
			const userId = sessionData?.user_id;
			const cmd = JSON.parse(msg);
			if (cmd.cmd_type === "type" && cmd.user_id != userId) {
				const player = gameState.players[cmd.user_id];
				player.currentWord += cmd.args[0];
				player.pos[1] += 1;
				setGameState(gameState);
			}

		}
	}, [msg])

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (!ready || !sessionReady || !socketReady) {
				return
			}
			if (e.key == ' ') {

				e.preventDefault();
			}

			const userId = sessionData?.user_id!;
			setGameState(prev => {
				const user = prev.players[userId];

				const correct = prev.wordList[user.pos[1]] == user.currentWord;
				if (correct && e.key === ' ') {
					prev.players[userId].currentWord = "";
					prev.players[userId].pos[0] += 1;
					prev.players[userId].pos[1] = 0;
					return prev;
				} else { return prev; }
			})

			if (e.key == "Backspace") {
				setGameState(prev => {
					const user = prev.players[userId];
					user.currentWord = user.currentWord.slice(0, user.currentWord.length - 1);
					user.pos[1] = Math.max(user.pos[1] - 1, 0);
					return prev;

				});
			}

			if (e.key.length === 1) {
				const c = e.key.charCodeAt(0);
				if (c > 32 && c < 127) {
					setGameState(prev => {
						const user = prev.players[userId];
						user.currentWord = user.currentWord.concat(e.key);
						user.pos[1] += 1;
						return prev;
					});
				}
			}
			const a = JSON.stringify(
				{
					cmd_type: "type",
					args: [e.key],
					user_id: sessionData?.user_id
				}
			)
			sockSend!(a)
		}

		gameDiv.current?.addEventListener('keydown', handleKeyPress)
		gameDiv.current?.focus()

		return () => {
			gameDiv.current?.removeEventListener('keydown', handleKeyPress)
		}
	}, [ready])

	useEffect(() => {
		const getWords = async () => {
			try {
				const response = await fetch("http://localhost:8000/game", {
					credentials: "include"
				});

				if (!response.ok) {
					console.error("Error retrieving data from the server");
				}

				const data = await response.json();
				console.log(data.players)
				setGameState({
					...data,
					currentPlayerId: sessionData?.user_id,
				} as GameState)
				setReady(true);
			} catch (e) {
				console.error(e);
			}
		}

		sessionReady && getWords();

	}, [sessionReady])


	return <div className="game" ref={gameDiv} tabIndex={0}>
		{/* <TypingText {...gameState} /> */}
		{sessionData?.user_id}
		{ready && socketReady && <TypingText {...gameState} />}
	</div>

}

export default Game;
