import { useTestMode } from "../Context/TestModeContext";

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

      <div className="chrome flex items-center gap-4 transition-opacity duration-400 ease-in-out">
        {[15, 30, 60].map((time) => {
          const active = testTime === time;
          return (
            <button
              key={time}
              type="button"
              onClick={() => setTestTime(time)}
              className={[
                "cursor-pointer rounded-md px-1.5 py-1 text-base transition-colors",
                active
                  ? "font-semibold text-accent opacity-100"
                  : "text-muted opacity-55 hover:opacity-85 hover:text-correct",
              ].join(" ")}
            >
              {time}s
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UpperMenu;
