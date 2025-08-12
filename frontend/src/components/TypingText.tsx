import { GameState } from "../types/game";

const ActiveWord: React.FC<{ wordToType: string, typedWord: string }> = ({ wordToType, typedWord }) => {
	const l = Math.max(wordToType.length, typedWord.length);
	const colorFromCheck = (i: number) => wordToType[i] == typedWord[i] ? "green" : "red"
	const remainingColor = wordToType.length > typedWord.length ? "white" : "red";

	const letters = [];
	for (let i = 0; i < l; ++i) {
		const char = typedWord[i] ?? wordToType[i];
		const color = i < typedWord.length ? colorFromCheck(i) : remainingColor;
		letters.push(<span key={i} style={{ color }}>{char}</span>)
	}

	return <div className='active-word'>
		{letters}
	</div>
}

const InactiveWord: React.FC<{ word: string }> = ({ word }) => {
	return <div className='inactive-word'>
		{word.split('').map(letter => <span className="letter">{letter}</span>)}
	</div>

}

const TypingText: React.FC<GameState> = ({ wordList, currentWord, currentWordIdx }) => {
	return <div className="typing-area" >
		{wordList?.map((word, idx) => <div className="word">
			{currentWordIdx != idx ?
				<InactiveWord word={word} /> :
				<ActiveWord wordToType={wordList[currentWordIdx]} typedWord={currentWord!} />
			}

		</div>)}
	</div>

}

export default TypingText;
