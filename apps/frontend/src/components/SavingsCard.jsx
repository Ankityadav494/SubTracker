import { formatCurrency } from "../utils/subscriptionHelpers";
import { statCardClass, subheadingClass } from "../utils/styles";

const SavingsCard = ({ savings }) => {
  if (!savings?.tips?.length) return null;

  return (
    <div className={`${statCardClass} border-amber-500/30`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={subheadingClass}>Potential savings</h3>
        {savings.totalPotentialSavings > 0 && (
          <span className="text-sm font-medium text-amber-400">
            ~{formatCurrency(savings.totalPotentialSavings)}/mo
          </span>
        )}
      </div>
      <ul className="space-y-2 text-left text-sm text-slate-400">
        {savings.tips.map((tip, i) => (
          <li key={i} className="flex gap-2 rounded-lg bg-amber-500/5 px-3 py-2">
            <span className="text-amber-400">•</span>
            {tip.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavingsCard;
