import { motion } from "motion/react";
import { useTestMode } from "../Context/TestModeContext";

const TIME_OPTIONS = [15, 30, 60];

const UpperMenu = ({
  countDown,
  liveWpm = null,
  liveAcc = null,
  testStart = false,
}) => {
  const { testTime, setTestTime } = useTestMode();

  return (
    <div className="flex min-h-8 w-full items-center justify-between font-mono">
      <div className="flex min-w-0 items-center gap-5">
        <div
          className={[
            "font-mono text-2xl font-bold tabular-nums text-accent transition-opacity duration-200",
            testStart ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {countDown}
        </div>
        <div
          className={[
            "flex items-center gap-5 font-mono text-lg text-muted transition-opacity duration-200",
            testStart ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <span className="tabular-nums">
            {liveWpm ?? 0}{" "}
            <span className="text-sm opacity-60">wpm</span>
          </span>
          <span className="tabular-nums">
            {liveAcc ?? 0}%{" "}
            <span className="text-sm opacity-60">acc</span>
          </span>
        </div>
      </div>

      <div className="chrome transition-opacity duration-400 ease-in-out">
        <div className="inline-flex h-9 w-fit items-center justify-center rounded-lg bg-surface p-[3px] text-muted">
          {TIME_OPTIONS.map((time) => {
            const active = testTime === time;
            return (
              <button
                key={time}
                type="button"
                onClick={() => setTestTime(time)}
                className={[
                  "relative inline-flex h-[calc(100%-1px)] cursor-pointer items-center justify-center rounded-md px-3 text-xs font-medium transition-colors duration-500 ease-in-out",
                  active
                    ? "text-correct"
                    : "text-muted hover:text-correct",
                ].join(" ")}
              >
                {active && (
                  <motion.span
                    layoutId="timer-pill"
                    className="absolute inset-0 rounded-md bg-bg shadow-sm"
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{time}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UpperMenu;
