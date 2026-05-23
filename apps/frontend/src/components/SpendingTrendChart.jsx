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
import { statCardClass, subheadingClass, mutedClass } from "../utils/styles";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "#475569", boxWidth: 12, font: { size: 11 } },
    },
  },
  scales: {
    x: {
      ticks: { color: "#475569", maxRotation: 45, minRotation: 0, font: { size: 10 } },
      grid: { color: "#e2e8f0" },
    },
    y: {
      ticks: { color: "#475569", font: { size: 10 } },
      grid: { color: "#e2e8f0" },
    },
  },
};

const SpendingTrendChart = ({ trends }) => {
  if (!trends?.length) {
    return (
      <div className={`${statCardClass} min-w-0`}>
        <h3 className={`mb-2 text-left ${subheadingClass}`}>Spending trend</h3>
        <p className={`text-sm ${mutedClass}`}>Add subscriptions to see trends over time.</p>
      </div>
    );
  }

  const data = {
    labels: trends.map((t) => t.label),
    datasets: [
      {
        label: "Monthly spend (₹)",
        data: trends.map((t) => t.totalMonthly),
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.12)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#2563eb",
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className={`${statCardClass} min-w-0`}>
      <h3 className={`mb-4 text-left ${subheadingClass}`}>Spending trend</h3>
      <div className="relative h-44 w-full sm:h-56 md:h-64">
        <Line data={data} options={lineOptions} />
      </div>
    </div>
  );
};

export default SpendingTrendChart;
