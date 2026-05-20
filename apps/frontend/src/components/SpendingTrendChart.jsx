import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { statCardClass, subheadingClass } from "../utils/styles";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SpendingTrendChart = ({ trends }) => {
  if (!trends?.length) {
    return (
      <div className={statCardClass}>
        <h3 className={`mb-2 text-left ${subheadingClass}`}>Spending trend</h3>
        <p className="text-sm text-stone-500">
          Trend data appears as you add subscriptions over time.
        </p>
      </div>
    );
  }

  const data = {
    labels: trends.map((t) => t.label),
    datasets: [
      {
        label: "Monthly spend (₹)",
        data: trends.map((t) => t.totalMonthly),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.15)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#fb7185",
      },
    ],
  };

  const options = {
    plugins: { legend: { labels: { color: "#a8a29e" } } },
    scales: {
      x: { ticks: { color: "#78716c" }, grid: { color: "#292524" } },
      y: { ticks: { color: "#78716c" }, grid: { color: "#292524" } },
    },
  };

  return (
    <div className={statCardClass}>
      <h3 className={`mb-4 text-left ${subheadingClass}`}>Spending trend</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default SpendingTrendChart;
