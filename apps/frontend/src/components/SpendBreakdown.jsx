import { formatCurrency } from "../utils/subscriptionHelpers";
import { statCardClass, subheadingClass } from "../utils/styles";

const barColors = [
  "bg-orange-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-fuchsia-500",
  "bg-stone-500",
];

const SpendBreakdown = ({ breakdown }) => {
  if (!breakdown?.length) return null;

  return (
    <div className={statCardClass}>
      <h3 className={`mb-4 text-left ${subheadingClass}`}>Cost breakdown</h3>
      <ul className="space-y-3">
        {breakdown.map((item, i) => (
          <li key={item._id}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-stone-100">{item.name}</span>
              <span className="text-orange-400">{formatCurrency(item.monthly)}/mo</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-stone-800">
              <div
                className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                style={{ width: `${item.percentOfTotal}%` }}
              />
            </div>
            <p className="mt-0.5 text-right text-xs text-stone-500">{item.percentOfTotal}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpendBreakdown;
