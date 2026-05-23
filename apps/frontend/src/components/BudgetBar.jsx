import { formatCurrency } from "../utils/subscriptionHelpers";
import { statCardClass, mutedClass } from "../utils/styles";

const BudgetBar = ({ budgetStatus }) => {
  if (!budgetStatus) return null;

  const { budget, spent, percentUsed, overBudget, remaining } = budgetStatus;

  return (
    <div className={`mb-6 min-w-0 ${statCardClass}`}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs sm:text-sm">
        <span className={mutedClass}>Monthly budget</span>
        <span className={`font-medium ${overBudget ? "text-red-600" : "text-sky-700"}`}>
          {formatCurrency(spent)} / {formatCurrency(budget)}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-sky-100 sm:h-3">
        <div
          className={`h-full rounded-full ${overBudget ? "bg-red-500" : "bg-gradient-to-r from-sky-500 to-blue-600"}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>
      <p className={`mt-2 text-xs ${mutedClass}`}>
        {overBudget
          ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
          : `${formatCurrency(remaining)} remaining`}
      </p>
    </div>
  );
};

export default BudgetBar;
