import { createRef, useEffect, useMemo, useRef, useState } from "react";
import UpperMenu from "./UpperMenu";
import { useTestMode } from "../Context/TestModeContext";
import Stats from "./Stats";
import randomWords from "random-words";

const TypingBox = ({ onChromeVisibilityChange }) => {
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
  const [isFocused, setIsFocused] = useState(true);
  const [capsOn, setCapsOn] = useState(false);
  const tabPressedRef = useRef(false);
  const chromeTimerRef = useRef(null);
  const testStartRef = useRef(false);
  const testEndRef = useRef(false);

  const [wordsArray, setWordsArray] = useState(() => randomWords(50));

  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);

  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map(() => createRef(null));
  }, [wordsArray]);

  const elapsed = Math.max(testTime - countDown, 1);
  const liveWpm = testStart
    ? Math.round(correctChars / 5 / (elapsed / 60))
    : null;

  const setChrome = (visible) => {
    onChromeVisibilityChange?.(visible);
  };

  const scheduleChromeHide = () => {
    clearTimeout(chromeTimerRef.current);
    setChrome(true);
    if (!testStartRef.current || testEndRef.current) return;
    chromeTimerRef.current = setTimeout(() => {
      if (testStartRef.current && !testEndRef.current) {
        setChrome(false);
      }
    }, 2500);
  };

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
          testEndRef.current = true;
          clearInterval(id);
          setChrome(true);
          clearTimeout(chromeTimerRef.current);
          return 0;
        }
        return latestCountDown - 1;
      });
    }
  };

  const resetTest = () => {
    clearInterval(intervalId);
    clearTimeout(chromeTimerRef.current);
    setCountDown(testTime);
    setCurrWordIndex(0);
    setCurrCharIndex(0);
    setTestStart(false);
    setTestEnd(false);
    testStartRef.current = false;
    testEndRef.current = false;
    setCorrectChars(0);
    setIncorrectChars(0);
    setMissedChars(0);
    setCorrectWords(0);
    setExtraChars(0);
    setGraphData([]);
    setWordsArray(randomWords(50));
    setChrome(true);
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
    if (e.getModifierState) {
      setCapsOn(e.getModifierState("CapsLock"));
    }

    if (!testStart) {
      startTimer();
      setTestStart(true);
      testStartRef.current = true;
      scheduleChromeHide();
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
    const onMouseMove = () => {
      if (testStartRef.current && !testEndRef.current) {
        scheduleChromeHide();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      clearTimeout(chromeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.getModifierState) {
        setCapsOn(e.getModifierState("CapsLock"));
      }

      if (e.key === "Tab") {
        e.preventDefault();
        tabPressedRef.current = true;
        return;
      }

      if (e.key === "Enter" && tabPressedRef.current) {
        e.preventDefault();
        tabPressedRef.current = false;
        resetTest();
        return;
      }

      const tag = e.target?.tagName?.toLowerCase();
      const inField =
        tag === "input" || tag === "textarea" || e.target?.isContentEditable;

      if (
        e.key === "Enter" &&
        !tabPressedRef.current &&
        !inField &&
        !testEndRef.current &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        focusInput();
      }
    };

    const onKeyUp = (e) => {
      if (e.key === "Tab") {
        tabPressedRef.current = false;
      }
      if (e.getModifierState) {
        setCapsOn(e.getModifierState("CapsLock"));
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
      <UpperMenu
        countDown={countDown}
        liveWpm={liveWpm}
        testStart={testStart}
      />

      {!testEnd && capsOn && (
        <div className="mx-auto mb-2.5 inline-flex items-center justify-center rounded-full border border-error/20 bg-error/10 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-error">
          Caps Lock
        </div>
      )}

      {testEnd ? (
        <Stats
          wpm={calculateWPM()}
          accuracy={calculateAcc()}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          missedChars={missedChars}
          extraChars={extraChars}
          graphData={graphData}
          onRestart={resetTest}
        />
      ) : (
        <div
          className="relative mx-auto h-[calc(4.875em+0.5rem)] w-full max-w-site cursor-text overflow-hidden text-left max-md:h-[calc(5.5em+0.5rem)]"
          onClick={focusInput}
        >
          <div
            className={[
              "words flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-xl leading-relaxed transition-opacity duration-200 md:text-2xl",
              !isFocused && "opacity-15",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {wordsArray.map((word, index) => (
              <span
                className="relative m-0"
                ref={wordsSpanRef[index]}
                key={index}
              >
                {word.split("").map((char, charIndex) => (
                  <span key={charIndex}>{char}</span>
                ))}
              </span>
            ))}
          </div>
          {!isFocused && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-[0.95rem] tracking-wide text-correct">
              Click or press Enter to focus
            </div>
          )}
        </div>
      )}

      <div className="chrome mt-5 flex flex-col items-center gap-4 transition-opacity duration-300">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-muted transition-colors hover:text-correct active:rotate-90"
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
            className="block h-[18px] w-[18px]"
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <polyline points="21 3 21 9 15 9" />
          </svg>
        </button>
        <div className="hidden items-center gap-1.5 text-xs text-muted opacity-85 md:flex">
          <kbd className="rounded border border-border bg-[var(--kbd-bg)] px-1.5 py-0.5 font-mono text-[10px]">
            tab
          </kbd>
          <span>+</span>
          <kbd className="rounded border border-border bg-[var(--kbd-bg)] px-1.5 py-0.5 font-mono text-[10px]">
            enter
          </kbd>
          <span>- restart test</span>
        </div>
      </div>

      <input
        type="text"
        className="absolute left-[-9999px] h-px w-px opacity-0"
        ref={inputRef}
        onKeyDown={handleUserInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
};

export default TypingBox;
