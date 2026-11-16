import { Bounce, toast } from "react-toastify";
import Graph from "./Graph";
import { useEffect, useMemo } from "react";
import { useSession } from "../lib/auth-client";
import { saveResult } from "../lib/api";
import { useTheme } from "../Context/ThemeContext";

const calcConsistency = (graphData) => {
  const values = graphData.map((i) => i[1]).filter((v) => Number.isFinite(v));
  if (values.length < 2) return 100;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 100;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const cv = Math.sqrt(variance) / mean;
  return Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
};

const Stats = ({
  wpm,
  accuracy,
  raw = 0,
  correctChars,
  incorrectChars,
  missedChars,
  extraChars,
  graphData,
  testTime = 15,
  onRestart,
}) => {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const toastTheme = theme.background === "#ffffff" ? "light" : "dark";
  const timeSet = new Set();

  const newGraph = graphData.filter((i) => {
    if (!timeSet.has(i[0])) {
      timeSet.add(i[0]);
      return true;
    }
    return false;
  });

  const consistency = useMemo(() => calcConsistency(newGraph), [newGraph]);
  const charactersLabel = `${correctChars}/${incorrectChars}/${extraChars}/${missedChars}`;

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
          characters: charactersLabel,
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
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) {
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
    <div className="mx-auto flex w-full max-w-site animate-results-enter flex-col gap-5 py-2 text-left">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-4">
        <div className="flex w-full shrink-0 flex-col gap-1 pt-2 md:w-36">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted">wpm</span>
            <span className="font-mono text-5xl font-bold leading-none text-accent md:text-6xl">
              {wpm}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-sm text-muted">acc</span>
            <span className="font-mono text-5xl font-bold leading-none text-accent md:text-6xl">
              {safeAccuracy}%
            </span>
          </div>
        </div>

        <div className="w-full md:flex-1">
          <Graph graphData={newGraph} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted">raw</span>
          <span className="font-mono text-2xl font-semibold text-correct">
            {raw}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted">characters</span>
          <span className="font-mono text-2xl font-semibold text-correct">
            {charactersLabel}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted">consistency</span>
          <span className="font-mono text-2xl font-semibold text-correct">
            {consistency}%
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted">time</span>
          <span className="font-mono text-2xl font-semibold text-correct">
            {testTime}s
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-4 py-2 font-sans text-sm text-muted transition-colors hover:text-accent"
        >
          Next test
        </button>
        <div className="flex items-center gap-1.5 text-xs text-muted opacity-80">
          <kbd className="rounded border border-border bg-(--kbd-bg) px-1.5 py-0.5 font-mono text-[10px]">
            enter
          </kbd>
          <span>- next test</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;
