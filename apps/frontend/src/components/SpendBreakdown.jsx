import { formatCurrency } from "../utils/subscriptionHelpers";
import { statCardClass, subheadingClass, mutedClass } from "../utils/styles";

const barColors = [
  "bg-sky-500",
  "bg-blue-600",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-slate-400",
];

const SpendBreakdown = ({ breakdown }) => {
  if (!breakdown?.length) return null;

  return (
    <div className={`${statCardClass} min-w-0`}>
      <h3 className={`mb-4 text-left ${subheadingClass}`}>Cost breakdown</h3>
      <ul className="space-y-3">
        {breakdown.map((item, i) => (
          <li key={item._id} className="min-w-0">
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-xs sm:text-sm">
              <span className="min-w-0 truncate text-slate-700">{item.name}</span>
              <span className="shrink-0 text-sky-600">
                {formatCurrency(item.monthly)}/mo
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-sky-100">
              <div
                className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                style={{ width: `${item.percentOfTotal}%` }}
              />
            </div>
            <p className={`mt-0.5 text-right text-xs ${mutedClass}`}>
              {item.percentOfTotal}%
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpendBreakdown;
