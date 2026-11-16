import { useTestMode } from "../Context/TestModeContext";

const UpperMenu = ({ countDown, liveWpm = null, testStart = false }) => {
  const { testTime, setTestTime } = useTestMode();

  return (
    <div className="chrome mx-auto flex w-full max-w-site items-center justify-between py-2 font-mono transition-opacity duration-300">
      <div className="flex items-baseline gap-4">
        <div className="min-w-[2ch] text-2xl font-bold text-accent md:text-[1.5rem]">
          {countDown}
        </div>
        <div
          className={[
            "min-w-[4.5rem] text-left text-base text-muted",
            testStart ? "opacity-100" : "opacity-45",
          ].join(" ")}
        >
          {testStart && liveWpm != null ? `${liveWpm} wpm` : "— wpm"}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {[15, 30, 60].map((time) => {
          const active = testTime === time;
          return (
            <button
              key={time}
              type="button"
              id={String(time)}
              onClick={() => setTestTime(time)}
              className={[
                "cursor-pointer text-[0.95rem] transition-colors",
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
