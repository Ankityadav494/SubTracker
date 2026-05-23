import { formatCurrency } from "../utils/subscriptionHelpers";
import { statCardClass, subheadingClass, mutedClass } from "../utils/styles";

const SavingsCard = ({ savings }) => {
  if (!savings?.tips?.length) return null;

  return (
    <div className={`mb-6 min-w-0 ${statCardClass}`}>
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <h3 className={subheadingClass}>Potential savings</h3>
        {savings.totalPotentialSavings > 0 && (
          <span className="text-sm font-medium text-emerald-600">
            ~{formatCurrency(savings.totalPotentialSavings)}/mo
          </span>
        )}
      </div>
      <ul className={`space-y-2 text-left text-sm ${mutedClass}`}>
        {savings.tips.map((tip, i) => (
          <li
            key={i}
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800"
          >
            {tip.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavingsCard;
