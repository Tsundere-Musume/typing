import { useEffect, useRef, useState } from "react";
import { GameState, Player } from "../types/game";

const ActiveWord: React.FC<{ wordToType: string, typedWord: string }> = ({ wordToType, typedWord }) => {
	const l = Math.max(wordToType.length, typedWord.length);
	const colorFromCheck = (i: number) => wordToType[i] == typedWord[i] ? "green" : "red"
	const remainingColor = wordToType.length > typedWord.length ? "white" : "red";
	const activeWordRef = useRef<HTMLDivElement | null>(null);
	const activeLetterRef = useRef<HTMLSpanElement | null>(null);
	const [caretProps, setCaretProps] = useState<CaretProps | null>(null);

	useEffect(() => {
		// console.log(activeWordRef.current)
		if (activeWordRef.current) {
			//TODO: don't question this, left for later 
			const elem = activeWordRef.current.firstElementChild ?? activeWordRef.current;
			const rect = elem.getBoundingClientRect();
			setCaretProps({
				position: {
					top: 0,
					left: (typedWord.length * rect.width),
				},
				dimension: {
					width: rect.width,
					height: rect.height,
				},
			});
			elem.scrollIntoView({ behavior: 'smooth', inline: 'center' });
		}
	}, [typedWord, activeWordRef])

	const letters = [];
	for (let i = 0; i < l; ++i) {
		const char = wordToType[i] ?? typedWord[i];
		const color = i < typedWord.length ? colorFromCheck(i) : remainingColor;
		const ref = i == typedWord.length ? activeLetterRef : null;
		letters.push(<span key={i} style={{ color }} ref={ref}>{char}</span>)
	}
	return <div className='active-word' style={{ position: 'relative' }} ref={activeWordRef}>
		{letters}
		{caretProps && <Caret {...caretProps} />}
	</div >
}


const InactiveWord: React.FC<{ word: string }> = ({ word }) => {
	return <div className='inactive-word'>
		{word.split('').map((letter, idx) => <span className="letter" key={idx}>{letter}</span>)}
	</div>

}

interface CaretProps {
	position: { top: number; left: number };
	dimension: { width: number; height: number; };
}

const Caret: React.FC<CaretProps> = ({ position, dimension }) => {
	return (
		<div
			style={{
				position: 'absolute',
				top: position.top,
				left: position.left,
				width: dimension.width,
				height: dimension.height,
				zIndex: -1,
				backgroundColor: 'rgba(0,255,255,0.5)',
				animation: 'blink 1s step-end infinite',
				transition: "top 0.1s ease, left 0.1s ease, height 0.1s ease"
			}}
		/>
	);
}

interface WordWithPlayersProps {
	wordToType: string;
	players: Player[];
};

function generateCarets(wordToType: string, players: Player[], width: number, height: number) {
	const l = wordToType.length;
	const result = [];
	for (const player of players) {
		result.push(
			<Caret position={{ top: 0, left: Math.min(l, player.currentWord.length) * width }} dimension={{ width, height }} />
		)
	}
	return result;
}
const WordWithPlayers: React.FC<WordWithPlayersProps> = ({ wordToType, players }) => {
	const letters = [];
	const wordRef = useRef<HTMLDivElement | null>(null);
	for (let i = 0; i < wordToType.length; ++i) {
		const char = wordToType[i];
		letters.push(<span key={i} >{char}</span>)
	}

	const [carets, setCarets] = useState<JSX.Element[]>([]);

	useEffect(() => {
		if (wordRef.current) {
			//TODO: don't question this, left for later 
			const elem = wordRef.current.firstElementChild ?? wordRef.current;
			const rect = elem.getBoundingClientRect();
			const r = generateCarets(wordToType, players, rect.width, rect.height);
			setCarets(r)
		}
	}, [wordRef])
	return <div className='active-word' style={{ position: 'relative' }} ref={wordRef}>
		{letters}
		{carets}
	</div >
}

const TypingText: React.FC<GameState> = ({ wordList, currentPlayerId, players }) => {
	const getPlayersOnWord = (idx: number) => {
		const result = [];
		for (const id in players) {
			if (id === currentPlayerId) {
				continue;
			}
			const player = players[id];
			if (idx === player.pos[0]) {
				result.push(player);
			}
		}

		return result;
	}
	const currentPlayer = players[currentPlayerId];

	const words: JSX.Element[] = [];
	for (let idx = 0; idx < wordList.length; ++idx) {
		const word = wordList[idx];
		const p = getPlayersOnWord(idx);

		if (idx === currentPlayer.pos[0]) {
			const currentWord = currentPlayer.currentWord;
			words.push(<ActiveWord wordToType={word} typedWord={currentWord!} key={idx} />);
		} else if (p.length > 0) {
			words.push(<WordWithPlayers wordToType={word} players={p} />);
		} else {
			words.push(<InactiveWord word={word} key={idx} />);
		}
	}

	return <div className="typing-area" >
		{words}
	</div>

}

export default TypingText;
