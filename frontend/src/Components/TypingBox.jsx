import { createRef, useEffect, useMemo, useRef, useState } from "react";
import UpperMenu from "./UpperMenu";
import { useTestMode } from "../Context/TestModeContext";
import Stats from "./Stats";
import randomWords from "random-words";

const EXTRA_CHAR_CAP = 10;

const CHAR_BASE = "relative inline-block transition-colors duration-75";
const CLS = {
  correct: `${CHAR_BASE} text-correct is-correct`,
  incorrect: `${CHAR_BASE} text-error is-incorrect`,
  extra: `${CHAR_BASE} text-error/60 is-extra`,
  current: `${CHAR_BASE} current`,
  currentRight: `${CHAR_BASE} is-correct current-right`,
  empty: CHAR_BASE,
};

const WORD_BASE = "relative m-0 whitespace-nowrap";
const WORD_ERROR = `${WORD_BASE} after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-error/50`;

const CARET_LEFT =
  "typing-cursor absolute top-0.5 -left-px h-[1.2em] w-0.5 rounded-full bg-accent";
const CARET_RIGHT =
  "typing-cursor absolute top-0.5 -right-px h-[1.2em] w-0.5 rounded-full bg-accent";

const clearCarets = (root) => {
  root?.querySelectorAll(".typing-cursor").forEach((el) => el.remove());
};

const placeCaret = (wordEl, charIdx, atEnd = false) => {
  if (!wordEl) return;
  clearCarets(wordEl.parentElement || wordEl);
  const letters = Array.from(wordEl.children);
  if (!letters.length) return;

  const target = atEnd
    ? letters[letters.length - 1]
    : letters[Math.min(charIdx, letters.length - 1)];
  if (!target) return;

  const caret = document.createElement("span");
  caret.className = atEnd ? CARET_RIGHT : CARET_LEFT;
  caret.setAttribute("aria-hidden", "true");
  target.prepend(caret);
};

const letterText = (el) => {
  if (!el) return "";
  return Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join("");
};

const TypingBox = ({ onChromeVisibilityChange }) => {
  const inputRef = useRef(null);
  const wordsLayerRef = useRef(null);
  const typingIdleRef = useRef(null);
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
  const [isActivelyTyping, setIsActivelyTyping] = useState(false);
  const [rowOffset, setRowOffset] = useState(0);
  const [screenFade, setScreenFade] = useState(1);
  const [showResults, setShowResults] = useState(false);

  const tabPressedRef = useRef(false);
  const chromeTimerRef = useRef(null);
  const testStartRef = useRef(false);
  const testEndRef = useRef(false);
  const currWordIndexRef = useRef(0);
  const currCharIndexRef = useRef(0);

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

  const markTypingActive = () => {
    setIsActivelyTyping(true);
    clearTimeout(typingIdleRef.current);
    typingIdleRef.current = setTimeout(() => setIsActivelyTyping(false), 1000);
  };

  const updateScroll = () => {
    requestAnimationFrame(() => {
      const wordEl = wordsSpanRef[currWordIndexRef.current]?.current;
      if (!wordEl) return;
      const lineH = wordEl.offsetHeight + 4;
      if (lineH > 0) {
        const row = Math.round(wordEl.offsetTop / lineH);
        setRowOffset(Math.max(0, row - 1) * lineH);
      }
    });
  };

  const syncCaret = (wordIdx, charIdx) => {
    requestAnimationFrame(() => {
      const wordEl = wordsSpanRef[wordIdx]?.current;
      if (!wordEl) return;
      const letters = Array.from(wordEl.children);
      const atEnd = charIdx >= letters.length;
      placeCaret(wordEl, charIdx, atEnd);
      updateScroll();
    });
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
          clearInterval(id);
          testEndRef.current = true;
          setChrome(true);
          clearTimeout(chromeTimerRef.current);
          setScreenFade(0);
          setTimeout(() => {
            setTestEnd(true);
            setShowResults(true);
            requestAnimationFrame(() => setScreenFade(1));
          }, 150);
          return 0;
        }
        return latestCountDown - 1;
      });
    }
  };

  const resetTest = () => {
    clearInterval(intervalId);
    clearTimeout(chromeTimerRef.current);
    clearTimeout(typingIdleRef.current);
    setScreenFade(0);

    setTimeout(() => {
      setCountDown(testTime);
      setCurrWordIndex(0);
      setCurrCharIndex(0);
      currWordIndexRef.current = 0;
      currCharIndexRef.current = 0;
      setTestStart(false);
      setTestEnd(false);
      setShowResults(false);
      testStartRef.current = false;
      testEndRef.current = false;
      setCorrectChars(0);
      setIncorrectChars(0);
      setMissedChars(0);
      setCorrectWords(0);
      setExtraChars(0);
      setGraphData([]);
      setRowOffset(0);
      setIsActivelyTyping(false);
      setWordsArray(randomWords(50));
      setChrome(true);
      focusInput();
      requestAnimationFrame(() => setScreenFade(1));
    }, 150);
  };

  const resetWordSpanRefClassname = () => {
    wordsSpanRef.forEach((ref) => {
      if (ref.current) {
        ref.current.className = WORD_BASE;
        Array.from(ref.current.children).forEach((child) => {
          clearCarets(child);
          child.className = CLS.empty;
        });
      }
    });

    const first = wordsSpanRef[0]?.current?.children?.[0];
    if (first) {
      first.className = CLS.current;
      placeCaret(wordsSpanRef[0].current, 0, false);
    }
    updateScroll();
  };

  const handleUserInput = (e) => {
    if (e.getModifierState) {
      setCapsOn(e.getModifierState("CapsLock"));
    }

    if (
      e.key === "Shift" ||
      e.key === "Control" ||
      e.key === "Alt" ||
      e.key === "Meta" ||
      e.key === "Tab" ||
      e.key === "Enter" ||
      e.key === "Dead" ||
      e.key === "Process"
    ) {
      return;
    }

    markTypingActive();

    if (!testStart) {
      startTimer();
      setTestStart(true);
      testStartRef.current = true;
      scheduleChromeHide();
    }

    const wordEl = wordsSpanRef[currWordIndex]?.current;
    if (!wordEl) return;
    const letters = Array.from(wordEl.children);
    if (!letters.length) return;

    if (e.keyCode === 32) {
      if (currCharIndex === 0) return;

      const baseLen = wordsArray[currWordIndex]?.length || 0;
      const correctInWord = wordEl.querySelectorAll(".is-correct").length;
      const extras = wordEl.querySelectorAll(".is-extra").length;
      if (correctInWord === baseLen && extras === 0) {
        setCorrectWords((w) => w + 1);
      } else {
        wordEl.className = WORD_ERROR;
      }

      if (letters.length <= currCharIndex) {
        letters[currCharIndex - 1]?.classList.remove("current-right");
      } else {
        setMissedChars((m) => m + (letters.length - currCharIndex));
        letters[currCharIndex]?.classList.remove("current");
      }

      clearCarets(wordsLayerRef.current);

      const nextIdx = currWordIndex + 1;
      const nextWord = wordsSpanRef[nextIdx]?.current;
      if (nextWord?.children?.[0]) {
        nextWord.children[0].className = CLS.current;
      }
      setCurrWordIndex(nextIdx);
      setCurrCharIndex(0);
      currWordIndexRef.current = nextIdx;
      currCharIndexRef.current = 0;
      syncCaret(nextIdx, 0);
      return;
    }

    if (e.keyCode === 8) {
      if (currCharIndex === 0) return;

      if (letters.length === currCharIndex) {
        const last = letters[currCharIndex - 1];
        if (last.classList.contains("is-extra")) {
          last.remove();
          const prev = wordEl.children[currCharIndex - 2];
          if (prev) {
            prev.className = `${prev.className
              .replace("current-right", "")
              .trim()} current-right`.trim();
          }
        } else {
          last.className = CLS.current;
        }
        const next = currCharIndex - 1;
        setCurrCharIndex(next);
        currCharIndexRef.current = next;
        syncCaret(currWordIndex, next);
        return;
      }

      letters[currCharIndex].className = CLS.empty;
      letters[currCharIndex - 1].className = CLS.current;
      const next = currCharIndex - 1;
      setCurrCharIndex(next);
      currCharIndexRef.current = next;
      syncCaret(currWordIndex, next);
      return;
    }

    if (e.key.length !== 1) return;

    if (currCharIndex === letters.length) {
      const extras = wordEl.querySelectorAll(".is-extra").length;
      if (extras >= EXTRA_CHAR_CAP) return;

      letters[currCharIndex - 1]?.classList.remove("current-right");
      const newSpan = document.createElement("span");
      newSpan.innerText = e.key;
      newSpan.className = `${CLS.extra} current-right`;
      wordEl.append(newSpan);
      const next = currCharIndex + 1;
      setCurrCharIndex(next);
      currCharIndexRef.current = next;
      setExtraChars((x) => x + 1);
      syncCaret(currWordIndex, next);
      return;
    }

    const active = letters[currCharIndex];
    if (e.key === letterText(active)) {
      active.className = CLS.correct;
      setCorrectChars((c) => c + 1);
    } else {
      active.className = CLS.incorrect;
      setIncorrectChars((c) => c + 1);
    }

    if (currCharIndex + 1 === letters.length) {
      active.className = `${active.className} current-right`.trim();
    } else {
      letters[currCharIndex + 1].className = CLS.current;
    }

    const next = currCharIndex + 1;
    setCurrCharIndex(next);
    currCharIndexRef.current = next;
    syncCaret(currWordIndex, next);
  };

  const calculateWPM = () => Math.round(correctChars / 5 / (testTime / 60));

  const calculateAcc = () => {
    if (!currWordIndex) return 0;
    return Math.round((correctWords / currWordIndex) * 100);
  };

  const calculateRaw = () => {
    const total = correctChars + incorrectChars + extraChars;
    return Math.round(total / 5 / (testTime / 60));
  };

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
      clearTimeout(typingIdleRef.current);
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
    <div className="mx-auto flex w-full max-w-site flex-col items-stretch gap-3">
      <UpperMenu
        countDown={countDown}
        liveWpm={liveWpm}
        testStart={testStart}
      />

      {!showResults && capsOn && (
        <div className="pointer-events-none z-30 mx-auto -mb-1 inline-flex items-center justify-center rounded border border-border bg-bg/95 px-2 py-0.5 font-mono text-[10px] text-accent shadow-sm backdrop-blur">
          Caps Lock
        </div>
      )}

      <div
        className="transition-[opacity,filter] duration-150 ease-out"
        style={{
          opacity: screenFade,
          filter: screenFade < 1 ? "blur(4px)" : "none",
        }}
      >
        {showResults ? (
          <Stats
            wpm={calculateWPM()}
            accuracy={calculateAcc()}
            raw={calculateRaw()}
            correctChars={correctChars}
            incorrectChars={incorrectChars}
            missedChars={missedChars}
            extraChars={extraChars}
            graphData={graphData}
            testTime={testTime}
            onRestart={resetTest}
          />
        ) : (
          <div
            className="relative h-[calc(4.875em+0.75rem)] w-full cursor-text overflow-hidden py-1 text-left font-mono text-[1.5rem] leading-relaxed lg:text-[1.875rem]"
            onClick={focusInput}
          >
            <div
              ref={wordsLayerRef}
              className={[
                "relative will-change-transform transition-transform duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)]",
                isActivelyTyping && "is-typing",
                !isFocused && "opacity-15",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ transform: `translateY(-${rowOffset}px)` }}
            >
              <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-untyped">
                {wordsArray.map((word, index) => (
                  <span
                    className={WORD_BASE}
                    ref={wordsSpanRef[index]}
                    key={`${word}-${index}`}
                  >
                    {word.split("").map((char, charIndex) => (
                      <span key={charIndex} className={CHAR_BASE}>
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
            {!isFocused && (
              <div className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center">
                <span className="flex items-center gap-2 text-sm font-medium text-accent">
                  Click or press Enter to focus
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {!showResults && (
        <div className="chrome mt-2 flex flex-col items-center gap-4 transition-opacity duration-400 ease-in-out">
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
              className="block h-4.5 w-4.5"
            >
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <polyline points="21 3 21 9 15 9" />
            </svg>
          </button>
          <div className="hidden items-center gap-4 text-xs text-muted md:flex">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-border bg-(--kbd-bg) px-1.5 py-0.5 font-mono text-[10px]">
                tab
              </kbd>
              <span>+</span>
              <kbd className="rounded border border-border bg-(--kbd-bg) px-1.5 py-0.5 font-mono text-[10px]">
                enter
              </kbd>
              <span>- restart test</span>
            </span>
          </div>
        </div>
      )}

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
