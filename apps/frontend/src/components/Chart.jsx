import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { statCardClass, subheadingClass } from "../utils/styles";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = [
  "#f97316",
  "#f43f5e",
  "#10b981",
  "#f59e0b",
  "#d946ef",
  "#78716c",
];

const Chart = ({ subscriptions }) => {
  const categoryMap = {};

  subscriptions.forEach((sub) => {
    categoryMap[sub.category] =
      (categoryMap[sub.category] || 0) + Number(sub.price);
  });

  const labels = Object.keys(categoryMap);
  const values = Object.values(categoryMap);

  const data = {
    labels,
    datasets: [
      {
        label: "Spending (₹)",
        data: values,
        backgroundColor: CHART_COLORS.slice(0, labels.length),
        borderColor: "#0c0a09",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#a8a29e", padding: 16 },
      },
    },
  };

  return (
    <div className={statCardClass}>
      <h3 className={`mb-4 text-left ${subheadingClass}`}>Category spending</h3>
      <div className="mx-auto max-h-72 max-w-sm">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default Chart;
