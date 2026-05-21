import { formatCurrency } from "../utils/subscriptionHelpers";
import { statCardClass, subheadingClass } from "../utils/styles";

const SavingsCard = ({ savings }) => {
  if (!savings?.tips?.length) return null;

  return (
    <div className={statCardClass}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={subheadingClass}>Potential savings</h3>
        {savings.totalPotentialSavings > 0 && (
          <span className="text-sm font-medium text-emerald-400">
            ~{formatCurrency(savings.totalPotentialSavings)}/mo
          </span>
        )}
      </div>
      <ul className="space-y-2 text-left text-sm text-stone-400">
        {savings.tips.map((tip, i) => (
          <li key={i} className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-amber-100">
            {tip.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavingsCard;
