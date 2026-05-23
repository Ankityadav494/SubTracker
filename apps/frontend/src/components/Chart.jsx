import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { statCardClass, subheadingClass } from "../utils/styles";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = [
  "#0ea5e9",
  "#2563eb",
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#64748b",
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#475569",
        padding: 12,
        boxWidth: 12,
        font: { size: 11 },
      },
    },
  },
};

const Chart = ({ subscriptions }) => {
  const categoryMap = {};
  subscriptions.forEach((sub) => {
    categoryMap[sub.category] =
      (categoryMap[sub.category] || 0) + Number(sub.price);
  });

  const labels = Object.keys(categoryMap);
  const data = {
    labels,
    datasets: [
      {
        label: "Spending (₹)",
        data: Object.values(categoryMap),
        backgroundColor: CHART_COLORS.slice(0, labels.length),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  if (labels.length === 0) {
    return (
      <div className={statCardClass}>
        <h3 className={`mb-2 text-left ${subheadingClass}`}>Category spending</h3>
        <p className="text-sm text-slate-500">No active subscriptions to chart.</p>
      </div>
    );
  }

  return (
    <div className={`${statCardClass} min-w-0`}>
      <h3 className={`mb-4 text-left ${subheadingClass}`}>Category spending</h3>
      <div className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm">
        <Pie data={data} options={chartOptions} />
      </div>
    </div>
  );
};

export default Chart;
