import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTheme } from "../Context/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = ({ graphData }) => {
  const { theme } = useTheme();
  const lineColor = theme.caret || theme.title;
  const gridColor =
    theme.background === "#ffffff"
      ? "rgba(113, 113, 123, 0.15)"
      : "rgba(255, 255, 255, 0.08)";

  return (
    <Line
      data={{
        labels: graphData.map((i) => i[0]),
        datasets: [
          {
            data: graphData.map((i) => i[1]),
            label: "wpm",
            borderColor: lineColor,
            backgroundColor: lineColor,
            tension: 0.25,
            pointRadius: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              color: theme.textColor,
              font: { family: "Space Grotesk" },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: theme.textColor },
            grid: { color: gridColor },
          },
          y: {
            ticks: { color: theme.textColor },
            grid: { color: gridColor },
          },
        },
      }}
    />
  );
};

export default Graph;
