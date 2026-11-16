import { useTestMode } from "../Context/TestModeContext";

const UpperMenu = ({ countDown, liveWpm = null, testStart = false }) => {
  const { testTime, setTestTime } = useTestMode();

  return (
    <div className="chrome mb-3 flex min-h-8 w-full items-center justify-between font-mono transition-opacity duration-[400ms] ease-in-out">
      <div className="flex min-w-0 items-center gap-5">
        <div className="font-mono text-2xl font-bold tabular-nums text-accent">
          {countDown}
        </div>
        <div
          className={[
            "font-mono text-lg text-muted transition-opacity duration-200",
            testStart ? "opacity-100" : "opacity-45",
          ].join(" ")}
        >
          {testStart && liveWpm != null ? `${liveWpm} wpm` : "— wpm"}
        </div>
      </div>

      <div className="flex items-center gap-4">
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
