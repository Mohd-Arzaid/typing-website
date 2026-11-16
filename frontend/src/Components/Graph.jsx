import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
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
  Filler,
  Legend
);

const Graph = ({ graphData }) => {
  const { theme } = useTheme();
  const lineColor = theme.caret || theme.title;
  const muted = theme.textColor;
  const gridColor =
    theme.background === "#ffffff"
      ? "rgba(113, 113, 123, 0.08)"
      : "rgba(255, 255, 255, 0.06)";
  const fillColor = `${lineColor}20`;

  return (
    <div className="h-60 w-full md:h-72">
      <Line
        data={{
          labels: graphData.map((i) => i[0]),
          datasets: [
            {
              data: graphData.map((i) => i[1]),
              label: "wpm",
              borderColor: lineColor,
              backgroundColor: fillColor,
              fill: true,
              tension: 0.35,
              pointRadius: 0,
              pointHoverRadius: 3,
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 600,
            easing: "easeOutQuart",
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor:
                theme.background === "#ffffff"
                  ? "rgba(250, 250, 250, 0.95)"
                  : "rgba(24, 24, 27, 0.95)",
              titleColor: muted,
              bodyColor: theme.correct || muted,
              borderColor:
                theme.background === "#ffffff"
                  ? "#e4e4e7"
                  : "rgba(255,255,255,0.12)",
              borderWidth: 1,
              displayColors: false,
              titleFont: { family: "Geist Mono", size: 11 },
              bodyFont: { family: "Geist Mono", size: 12 },
            },
          },
          scales: {
            x: {
              ticks: {
                color: muted,
                font: { family: "Geist Mono", size: 10 },
                maxTicksLimit: 8,
              },
              grid: { color: gridColor, drawBorder: false },
              border: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: muted,
                font: { family: "Geist Mono", size: 10 },
              },
              grid: { color: gridColor, drawBorder: false },
              border: { display: false },
            },
          },
        }}
      />
    </div>
  );
};

export default Graph;
