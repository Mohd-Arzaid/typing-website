import { Bounce, toast } from "react-toastify";
import Graph from "./Graph";
import { useEffect } from "react";
import { useSession } from "../lib/auth-client";
import { saveResult } from "../lib/api";
import { useTheme } from "../Context/ThemeContext";

const Stats = ({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  missedChars,
  extraChars,
  graphData,
  onRestart,
}) => {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const toastTheme = theme.background === "#ffffff" ? "light" : "dark";
  let timeSet = new Set();

  const newGraph = graphData.filter((i) => {
    if (!timeSet.has(i[0])) {
      timeSet.add(i[0]);
      return i;
    }
  });

  useEffect(() => {
    const pushDataToDB = async () => {
      if (Number.isNaN(accuracy)) {
        toast.error("Invalid test", {
          position: "top-right",
          autoClose: 5000,
          theme: toastTheme,
          transition: Bounce,
        });
        return;
      }

      if (!session?.user) {
        toast.warning("Login to save result", {
          position: "top-right",
          autoClose: 5000,
          theme: toastTheme,
          transition: Bounce,
        });
        return;
      }

      try {
        await saveResult({
          wpm,
          accuracy,
          characters: `${correctChars}/${incorrectChars}/${missedChars}/${extraChars}`,
        });
        toast.success("Data Saved to DB", {
          position: "top-right",
          autoClose: 5000,
          theme: toastTheme,
          transition: Bounce,
        });
      } catch {
        toast.error("Not able to save result", {
          position: "top-right",
          autoClose: 5000,
          theme: toastTheme,
          transition: Bounce,
        });
      }
    };

    pushDataToDB();
  }, []);

  useEffect(() => {
    if (!onRestart) return;

    const onKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        e.target?.isContentEditable
      ) {
        return;
      }
      if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        onRestart();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onRestart]);

  const safeAccuracy = Number.isNaN(accuracy) ? 0 : accuracy;

  return (
    <div className="mx-auto flex w-full max-w-site flex-col gap-6 text-left md:flex-row md:gap-6">
      <div className="flex w-full flex-col justify-center gap-5 md:w-[30%]">
        <div className="flex flex-col gap-0.5">
          <div className="text-sm tracking-wide text-muted lowercase">wpm</div>
          <div className="font-mono text-4xl font-bold leading-tight text-correct md:text-[2.75rem]">
            {wpm}
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="text-sm tracking-wide text-muted lowercase">acc</div>
          <div className="font-mono text-4xl font-bold leading-tight text-correct md:text-[2.75rem]">
            {safeAccuracy}%
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="text-sm tracking-wide text-muted lowercase">
            characters
          </div>
          <div className="font-mono text-xl font-semibold text-muted">
            {correctChars}/{incorrectChars}/{missedChars}/{extraChars}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted opacity-80">
          <kbd className="rounded border border-border bg-[var(--kbd-bg)] px-1.5 py-0.5 font-mono text-[10px]">
            enter
          </kbd>
          <span>- next test</span>
        </div>
      </div>

      <div className="min-h-[220px] w-full md:min-h-[260px] md:w-[70%]">
        <Graph graphData={newGraph} />
      </div>
    </div>
  );
};

export default Stats;
