import { formatCurrency } from "../utils/subscriptionHelpers";
import { statCardClass, subheadingClass } from "../utils/styles";

const SpendBreakdown = ({ breakdown }) => {
  if (!breakdown?.length) return null;

  return (
    <div className={statCardClass}>
      <h3 className={`mb-4 text-left ${subheadingClass}`}>Cost breakdown</h3>
      <ul className="space-y-3">
        {breakdown.map((item) => (
          <li key={item._id}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-300">{item.name}</span>
              <span className="text-slate-400">{formatCurrency(item.monthly)}/mo</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-400"
                style={{ width: `${item.percentOfTotal}%` }}
              />
            </div>
            <p className="mt-0.5 text-right text-xs text-slate-500">{item.percentOfTotal}% of spend</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpendBreakdown;
