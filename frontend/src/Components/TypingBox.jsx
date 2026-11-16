import { createRef, useEffect, useMemo, useRef, useState } from "react";
import UpperMenu from "./UpperMenu";
import { useTestMode } from "../Context/TestModeContext";
import Stats from "./Stats";
import randomWords from "random-words";

const TypingBox = () => {
  const inputRef = useRef(null);
  const { testTime } = useTestMode();
  const [countDown, setCountDown] = useState(testTime);
  const [intervalId, setIntervalId] = useState(null);
  const [testStart, setTestStart] = useState(false);
  const [testEnd, setTestEnd] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [missedChars, setMissedChars] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [graphData, setGraphData] = useState([]);
  const tabPressedRef = useRef(false);

  const [wordsArray, setWordsArray] = useState(() => randomWords(50));

  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);

  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map(() => createRef(null));
  }, [wordsArray]);

  const startTimer = () => {
    const id = setInterval(timer, 1000);
    setIntervalId(id);
    function timer() {
      setCountDown((latestCountDown) => {
        setCorrectChars((correctCharsLatest) => {
          setGraphData((graphDataLatest) => [
            ...graphDataLatest,
            [
              testTime - latestCountDown + 1,
              correctCharsLatest / 5 / ((testTime - latestCountDown + 1) / 60),
            ],
          ]);
          return correctCharsLatest;
        });

        if (latestCountDown === 1) {
          setTestEnd(true);
          clearInterval(id);
          return 0;
        }
        return latestCountDown - 1;
      });
    }
  };

  const resetTest = () => {
    clearInterval(intervalId);
    setCountDown(testTime);
    setCurrWordIndex(0);
    setCurrCharIndex(0);
    setTestStart(false);
    setTestEnd(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setMissedChars(0);
    setCorrectWords(0);
    setExtraChars(0);
    setGraphData([]);
    setWordsArray(randomWords(50));
    focusInput();
  };

  const resetWordSpanRefClassname = () => {
    wordsSpanRef.forEach((ref) => {
      if (ref.current) {
        Array.from(ref.current.childNodes).forEach(
          (child) => (child.className = "")
        );
      }
    });

    if (wordsSpanRef[0]?.current) {
      wordsSpanRef[0].current.childNodes[0].className = "current";
    }
  };

  const handleUserInput = (e) => {
    if (!testStart) {
      startTimer();
      setTestStart(true);
    }

    const allCurrChars = wordsSpanRef[currWordIndex]?.current?.childNodes;
    if (!allCurrChars) return;

    if (e.keyCode === 32) {
      const correctCharsInWord =
        wordsSpanRef[currWordIndex]?.current?.querySelectorAll(".correct") ||
        [];

      if (correctCharsInWord.length === allCurrChars.length) {
        setCorrectWords(correctWords + 1);
      }

      if (allCurrChars.length <= currCharIndex) {
        allCurrChars[currCharIndex - 1].classList.remove("current-right");
      } else {
        setMissedChars(missedChars + (allCurrChars.length - currCharIndex));
        allCurrChars[currCharIndex].classList.remove("current");
      }

      if (wordsSpanRef[currWordIndex + 1]?.current) {
        wordsSpanRef[currWordIndex + 1].current.childNodes[0].className =
          "current";
      }
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(0);

      return;
    }

    if (e.keyCode === 8) {
      if (currCharIndex !== 0) {
        if (allCurrChars.length === currCharIndex) {
          if (allCurrChars[currCharIndex - 1].className.includes("extra")) {
            allCurrChars[currCharIndex - 1].remove();
            allCurrChars[currCharIndex - 2].className += " current-right";
          } else {
            allCurrChars[currCharIndex - 1].className = "current";
          }

          setCurrCharIndex(currCharIndex - 1);
          return;
        }
        allCurrChars[currCharIndex].className = "";
        allCurrChars[currCharIndex - 1].className = "current";
        setCurrCharIndex(currCharIndex - 1);
      }
      return;
    }

    if (currCharIndex === allCurrChars.length) {
      const newSpan = document.createElement("span");
      newSpan.innerText = e.key;
      newSpan.className = "incorrect extra current-right";
      allCurrChars[currCharIndex - 1].classList.remove("current-right");
      wordsSpanRef[currWordIndex].current.append(newSpan);
      setCurrCharIndex(currCharIndex + 1);
      setExtraChars(extraChars + 1);
      return;
    }

    if (e.key === allCurrChars[currCharIndex].innerText) {
      allCurrChars[currCharIndex].className = "correct";
      setCorrectChars(correctChars + 1);
    } else {
      allCurrChars[currCharIndex].className = "incorrect";
      setIncorrectChars(incorrectChars + 1);
    }

    if (currCharIndex + 1 === allCurrChars.length) {
      allCurrChars[currCharIndex].className += " current-right";
    } else {
      allCurrChars[currCharIndex + 1].className = "current";
    }

    setCurrCharIndex(currCharIndex + 1);
  };

  const calculateWPM = () => Math.round(correctChars / 5 / (testTime / 60));

  const calculateAcc = () => Math.round((correctWords / currWordIndex) * 100);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    resetTest();
  }, [testTime]);

  useEffect(() => {
    resetWordSpanRefClassname();
  }, [wordsArray]);

  useEffect(() => {
    focusInput();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        tabPressedRef.current = true;
        return;
      }

      if (e.key === "Enter" && tabPressedRef.current) {
        e.preventDefault();
        tabPressedRef.current = false;
        resetTest();
      }
    };

    const onKeyUp = (e) => {
      if (e.key === "Tab") {
        tabPressedRef.current = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [intervalId, testTime]);

  return (
    <div>
      <UpperMenu countDown={countDown} />
      {testEnd ? (
        <Stats
          wpm={calculateWPM()}
          accuracy={calculateAcc()}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          missedChars={missedChars}
          extraChars={extraChars}
          graphData={graphData}
        />
      ) : (
        <div className="type-box" onClick={focusInput}>
          <div className="words">
            {wordsArray.map((word, index) => (
              <span className="word" ref={wordsSpanRef[index]} key={index}>
                {word.split("").map((char, charIndex) => (
                  <span key={charIndex}>{char}</span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="test-controls">
        <button
          type="button"
          className="restart-btn"
          onClick={resetTest}
          aria-label="Restart test"
          title="Restart test"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <polyline points="21 3 21 9 15 9" />
          </svg>
        </button>
        <div className="shortcut-hint">
          <kbd>tab</kbd>
          <span>+</span>
          <kbd>enter</kbd>
          <span>- restart test</span>
        </div>
      </div>

      <input
        type="text"
        className="hidden-input"
        ref={inputRef}
        onKeyDown={handleUserInput}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
};

export default TypingBox;
