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

  return (
    <div className="stats-box">
      <div className="left-stats">
        <div className="title">WPM</div>
        <div className="subtitle">{wpm}</div>

        <div className="title">Accuracy</div>
        <div className="subtitle">{accuracy}</div>

        <div className="title">Characters</div>
        <div className="subtitle">
          {correctChars}/{incorrectChars}/{missedChars}/{extraChars}
        </div>
      </div>

      <div className="right-stats">
        <Graph graphData={newGraph} />
      </div>
    </div>
  );
};

export default Stats;
