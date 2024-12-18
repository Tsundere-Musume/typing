import React, { useEffect, useRef, useState } from "react";
import Timer from "./components/Timer";

const Typer: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  //const [text, setText] = useState<string[]>("These are the test words. hope they overflow to the end of the world".split(" ").map(c => c + " "));
  const [text, setText] = useState<string[]>("These are the test words. hope they overflow to the end of the world".split(" "));
  const [currentWord, setCurrentWord] = useState<string>("");
  const [letterIdx, setLetterIdx] = useState<number>(0);
  const [wordIdx, setWordIdx] = useState<number>(0);

  function handleKeyPresses(e: KeyboardEvent): void {
    if (e.key.length == 1) {
      const c = e.key.charCodeAt(0);
      if (e.key == " " && text[wordIdx] === currentWord) {
        setCurrentWord("");
        setLetterIdx(0);
        setWordIdx(prev => prev + 1);
        return;
      }
      let newWord = currentWord.concat(e.key);
      if (c > 32 && c < 127) {
        setCurrentWord(newWord);
        setLetterIdx(prev => prev + 1);
      }

    } else {
      switch (e.key) {
        case "Backspace":
          if (letterIdx > 0) {
            setLetterIdx(prev => prev - 1);
            setCurrentWord(prev => prev.slice(0, prev.length - 1));
          }
          break;
      }
    }
  }

  useEffect(() => {
    const element = divRef.current;
    element?.addEventListener("keydown", handleKeyPresses);
    element?.focus();
    return () => {
      element?.removeEventListener("keydown", handleKeyPresses);
    }
  }, [currentWord, wordIdx, letterIdx])


  const words = text.map((word, idx) => {
      return <div className="word" >
      {
        idx != wordIdx ? [...word].map(letter => <div className='letter'>{letter}</div>) :
          Array.from({length: currentWord.length>= word.length ? currentWord.length + 1: word.length}, (_, i) => i).map(idx => {
            if (idx >= word.length && idx < letterIdx)
              return <div className="incorrect-letter">{currentWord[idx]}</div>
            else if (idx < letterIdx && word[idx] != currentWord[idx])
              return <div className="incorrect-letter">{word[idx]}</div>
            else if (idx == letterIdx && letterIdx < word.length)
              return <div className="active-letter"  ><div className="caret">&nbsp;</div>{word[idx]}</div>;
            else if (idx >= currentWord.length && idx >= word.length)
              return <div className="active-letter"  ><div className="caret">&nbsp;</div></div>;
            return <div className="letter">{word[idx]}</div>
          }
          )
      }
    </div>
  });

  return <>
    <Timer />
    <div ref={divRef} tabIndex={0} className='typing-area'>
      {words}
    </div>
  </>

}

export default Typer;
