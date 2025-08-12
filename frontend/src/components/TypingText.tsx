import { useEffect, useRef, useState } from "react";
import { GameState } from "../types/game";

const ActiveWord: React.FC<{ wordToType: string, typedWord: string }> = ({ wordToType, typedWord }) => {
	const l = Math.max(wordToType.length, typedWord.length);
	const colorFromCheck = (i: number) => wordToType[i] == typedWord[i] ? "green" : "red"
	const remainingColor = wordToType.length > typedWord.length ? "white" : "red";
	const activeWordRef = useRef<HTMLDivElement | null>(null);

	const [caretProps, setCaretProps] = useState<CaretProps | null>(null);
	useEffect(() => {
		if (activeWordRef.current) {
			const elem = activeWordRef.current.firstElementChild ?? activeWordRef.current;
			const rect = elem.getBoundingClientRect();
			setCaretProps({
				position: {
					top: rect.top,
					left: rect.left + (rect.width * typedWord.length),
				},
				dimension: {
					width: rect.width,
					height: rect.height,
				},
			});
			elem.scrollIntoView({ behavior: 'smooth', inline: 'center' });
		}
	}, [typedWord])

	const letters = [];
	for (let i = 0; i < l; ++i) {
		const char = typedWord[i] ?? wordToType[i];
		const color = i < typedWord.length ? colorFromCheck(i) : remainingColor;
		letters.push(<span key={i} style={{ color }}>{char}</span>)
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
				position: 'fixed',
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

const TypingText: React.FC<GameState> = ({ wordList, currentWord, currentWordIdx }) => {
	return <div className="typing-area" >
		{wordList?.map((word, idx) =>
			currentWordIdx != idx ?
				<InactiveWord word={word} key={idx} /> :
				<ActiveWord wordToType={wordList[currentWordIdx]} typedWord={currentWord!} key={idx} />
		)}
	</div>

}

export default TypingText;
