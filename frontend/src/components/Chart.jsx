import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ subscriptions }) => {
  const categoryMap = {};

  subscriptions.forEach((sub) => {
    categoryMap[sub.category] =
      (categoryMap[sub.category] || 0) + sub.price;
  });

  const data = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        label: "Spending",
        data: Object.values(categoryMap),
      },
    ],
  };

  return (
    <div style={{ width: "300px" }}>
      <h3>Category Spending</h3>
      <Pie data={data} />
    </div>
  );
};

export default Chart;
