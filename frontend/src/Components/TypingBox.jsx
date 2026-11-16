import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { IconRefresh } from "@tabler/icons-react";
import UpperMenu from "./UpperMenu";
import { useTestMode } from "../Context/TestModeContext";
import Stats from "./Stats";
import randomWords from "random-words";

const EXTRA_CHAR_CAP = 10;
const WORD_REFILL_THRESHOLD = 10;
const WORD_BATCH = 50;

const CHAR_BASE = "relative inline-block transition-colors duration-[60ms]";
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

const CARET_SPRING = { type: "spring", stiffness: 700, damping: 38, mass: 0.6 };
const CARET_LEFT =
  "typing-cursor absolute top-0.5 -left-px h-[1.2em] w-0.5 rounded-full bg-caret";
const CARET_RIGHT =
  "typing-cursor absolute top-0.5 -right-px h-[1.2em] w-0.5 rounded-full bg-caret";

const Caret = ({ atEnd = false }) => (
  <motion.span
    layoutId="cursor-active"
    className={atEnd ? CARET_RIGHT : CARET_LEFT}
    transition={CARET_SPRING}
    aria-hidden="true"
  />
);

const letterText = (el) => {
  if (!el) return "";
  return Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join("");
};

const TypingBox = () => {
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
  const [liveWpm, setLiveWpm] = useState(null);
  const [liveAcc, setLiveAcc] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [isFocused, setIsFocused] = useState(true);
  const [capsOn, setCapsOn] = useState(false);
  const [isActivelyTyping, setIsActivelyTyping] = useState(false);
  const [rowOffset, setRowOffset] = useState(0);
  const [screenFade, setScreenFade] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [restartSpinning, setRestartSpinning] = useState(false);
  const [wordsEpoch, setWordsEpoch] = useState(0);

  const tabPressedRef = useRef(false);
  const testStartRef = useRef(false);
  const testEndRef = useRef(false);
  const currWordIndexRef = useRef(0);
  const currCharIndexRef = useRef(0);
  const correctCharsRef = useRef(0);
  const incorrectCharsRef = useRef(0);
  const missedCharsRef = useRef(0);
  const correctWordsRef = useRef(0);
  const extraCharsRef = useRef(0);
  const intervalIdRef = useRef(null);

  const [wordsArray, setWordsArray] = useState(() => randomWords(WORD_BATCH));
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);

  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map(() => createRef(null));
  }, [wordsArray.length]);

  const flushMetrics = () => {
    setCorrectChars(correctCharsRef.current);
    setIncorrectChars(incorrectCharsRef.current);
    setMissedChars(missedCharsRef.current);
    setCorrectWords(correctWordsRef.current);
    setExtraChars(extraCharsRef.current);
  };

  const updateLiveStats = (secondsElapsed) => {
    const elapsed = Math.max(secondsElapsed, 1);
    const correct = correctCharsRef.current;
    const typed = correct + incorrectCharsRef.current;
    setLiveWpm(Math.round(correct / 5 / (elapsed / 60)));
    setLiveAcc(typed > 0 ? Math.round((correct / typed) * 100) : 0);
  };

  const markTypingActive = () => {
    setIsActivelyTyping(true);
    clearTimeout(typingIdleRef.current);
    typingIdleRef.current = setTimeout(() => setIsActivelyTyping(false), 1000);
  };

  const ensureWordsAhead = (wordIdx) => {
    setWordsArray((prev) => {
      if (prev.length - wordIdx > WORD_REFILL_THRESHOLD) return prev;
      return [...prev, ...randomWords(WORD_BATCH)];
    });
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

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const startTimer = () => {
    const id = setInterval(timer, 1000);
    intervalIdRef.current = id;
    setIntervalId(id);
    function timer() {
      setCountDown((latestCountDown) => {
        const nextElapsed = testTime - latestCountDown + 1;
        setGraphData((graphDataLatest) => [
          ...graphDataLatest,
          [
            nextElapsed,
            correctCharsRef.current / 5 / (nextElapsed / 60),
          ],
        ]);
        updateLiveStats(nextElapsed);

        if (latestCountDown === 1) {
          clearInterval(id);
          intervalIdRef.current = null;
          testEndRef.current = true;
          flushMetrics();
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
    clearInterval(intervalIdRef.current || intervalId);
    intervalIdRef.current = null;
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
      correctCharsRef.current = 0;
      incorrectCharsRef.current = 0;
      missedCharsRef.current = 0;
      correctWordsRef.current = 0;
      extraCharsRef.current = 0;
      setCorrectChars(0);
      setIncorrectChars(0);
      setMissedChars(0);
      setCorrectWords(0);
      setExtraChars(0);
      setLiveWpm(null);
      setLiveAcc(null);
      setGraphData([]);
      setRowOffset(0);
      setIsActivelyTyping(false);
      setWordsArray(randomWords(WORD_BATCH));
      setWordsEpoch((n) => n + 1);
      focusInput();
      requestAnimationFrame(() => setScreenFade(1));
    }, 150);
  };

  const handleRestartClick = (e) => {
    e?.stopPropagation?.();
    setRestartSpinning(true);
    setTimeout(() => setRestartSpinning(false), 600);
    resetTest();
  };

  const handlePlaygroundClick = () => {
    if (!isFocused) {
      focusInput();
      return;
    }
    resetTest();
  };

  const resetWordSpanRefClassname = () => {
    wordsSpanRef.forEach((ref) => {
      if (ref.current) {
        ref.current.className = WORD_BASE;
        Array.from(ref.current.children).forEach((child) => {
          child.className = CLS.empty;
        });
      }
    });

    const first = wordsSpanRef[0]?.current?.children?.[0];
    if (first) {
      first.className = CLS.current;
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
    }

    ensureWordsAhead(currWordIndex);

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
        correctWordsRef.current += 1;
      } else {
        wordEl.className = WORD_ERROR;
      }

      if (letters.length <= currCharIndex) {
        letters[currCharIndex - 1]?.classList.remove("current-right");
      } else {
        missedCharsRef.current += letters.length - currCharIndex;
        letters[currCharIndex]?.classList.remove("current");
      }

      const nextIdx = currWordIndex + 1;
      const nextWord = wordsSpanRef[nextIdx]?.current;
      if (nextWord?.children?.[0]) {
        nextWord.children[0].className = CLS.current;
      }
      setCurrWordIndex(nextIdx);
      setCurrCharIndex(0);
      currWordIndexRef.current = nextIdx;
      currCharIndexRef.current = 0;
      updateScroll();
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
          extraCharsRef.current = Math.max(0, extraCharsRef.current - 1);
        } else {
          last.className = CLS.current;
        }
        const next = currCharIndex - 1;
        setCurrCharIndex(next);
        currCharIndexRef.current = next;
        updateScroll();
        return;
      }

      letters[currCharIndex].className = CLS.empty;
      letters[currCharIndex - 1].className = CLS.current;
      const next = currCharIndex - 1;
      setCurrCharIndex(next);
      currCharIndexRef.current = next;
      updateScroll();
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
      extraCharsRef.current += 1;
      updateScroll();
      return;
    }

    const active = letters[currCharIndex];
    if (e.key === letterText(active)) {
      active.className = CLS.correct;
      correctCharsRef.current += 1;
    } else {
      active.className = CLS.incorrect;
      incorrectCharsRef.current += 1;
    }

    if (currCharIndex + 1 === letters.length) {
      active.className = `${active.className} current-right`.trim();
    } else {
      letters[currCharIndex + 1].className = CLS.current;
    }

    const next = currCharIndex + 1;
    setCurrCharIndex(next);
    currCharIndexRef.current = next;
    updateScroll();
  };

  const calculateWPM = () =>
    Math.round(correctChars / 5 / (testTime / 60));

  const calculateAcc = () => {
    if (!currWordIndex) return 0;
    return Math.round((correctWords / currWordIndex) * 100);
  };

  const calculateRaw = () => {
    const total = correctChars + incorrectChars + extraChars;
    return Math.round(total / 5 / (testTime / 60));
  };

  useEffect(() => {
    resetTest();
  }, [testTime]);

  useEffect(() => {
    resetWordSpanRefClassname();
  }, [wordsEpoch]);

  useEffect(() => {
    if (!testStartRef.current || testEndRef.current) return;
    const idx = currWordIndexRef.current;
    const charIdx = currCharIndexRef.current;
    requestAnimationFrame(() => {
      const wordEl = wordsSpanRef[idx]?.current;
      if (!wordEl) return;
      if (!wordEl.querySelector(".current, .current-right")) {
        if (charIdx === 0 && wordEl.children[0]) {
          wordEl.children[0].className = CLS.current;
        }
      }
      updateScroll();
    });
  }, [wordsArray.length]);

  useEffect(() => {
    focusInput();
  }, []);

  useEffect(() => {
    return () => {
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
      {!showResults && (
        <UpperMenu
          countDown={countDown}
          liveWpm={liveWpm}
          liveAcc={liveAcc}
          testStart={testStart}
        />
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
          <div className="relative w-full">
            {capsOn && (
              <div className="pointer-events-none absolute top-3 right-0 left-0 z-30 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 rounded border border-border bg-bg/95 px-2 py-0.5 font-mono text-[10px] text-accent shadow-sm backdrop-blur">
                  Caps Lock
                </span>
              </div>
            )}

            <div
              className={[
                "relative h-[calc(4.875em+0.625rem)] w-full cursor-text overflow-hidden text-left font-mono text-[1.5rem] leading-relaxed lg:text-[1.875rem]",
                isActivelyTyping && "is-typing",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={handlePlaygroundClick}
            >
              <input
                type="text"
                className="absolute opacity-0"
                ref={inputRef}
                onKeyDown={handleUserInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />

              {rowOffset > 0 && (
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-bg to-transparent" />
              )}

              <div
                ref={wordsLayerRef}
                className={[
                  "relative will-change-transform transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)]",
                  !isFocused && "opacity-15",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ transform: `translateY(-${rowOffset}px)` }}
              >
                <LayoutGroup id="words">
                  <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-untyped">
                    {wordsArray.map((word, index) => {
                      const isActiveWord = index === currWordIndex;
                      const cursorAtEnd =
                        isActiveWord && currCharIndex >= word.length;

                      return (
                        <span
                          className={WORD_BASE}
                          ref={wordsSpanRef[index]}
                          key={`${word}-${index}`}
                        >
                          {word.split("").map((char, charIndex) => {
                            const showCaretLeft =
                              isActiveWord && charIndex === currCharIndex;
                            const showCaretRight =
                              cursorAtEnd && charIndex === word.length - 1;

                            return (
                              <span key={charIndex} className={CHAR_BASE}>
                                {showCaretLeft && <Caret />}
                                {showCaretRight && <Caret atEnd />}
                                {char}
                              </span>
                            );
                          })}
                        </span>
                      );
                    })}
                  </div>
                </LayoutGroup>
              </div>

              {!isFocused && (
                <div
                  className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    focusInput();
                  }}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-accent">
                    Click or press Enter to focus
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!showResults && (
        <div className="mt-2 flex flex-col items-center gap-4">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted transition-colors hover:text-correct"
            onClick={handleRestartClick}
            aria-label="Restart test"
            title="Restart test"
          >
            <span
              className="inline-flex"
              style={{
                transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                transform: restartSpinning ? "rotate(360deg)" : "rotate(0deg)",
              }}
            >
              <IconRefresh size={18} stroke={2} aria-hidden />
            </span>
          </button>
          <div className="hidden items-center gap-4 text-base text-muted md:flex">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-border bg-(--kbd-bg) px-2 py-0.5 font-mono text-sm">
                tab
              </kbd>
              <span>+</span>
              <kbd className="rounded border border-border bg-(--kbd-bg) px-2 py-0.5 font-mono text-sm">
                enter
              </kbd>
              <span>- restart test</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingBox;
