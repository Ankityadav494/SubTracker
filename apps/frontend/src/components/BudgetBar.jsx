import { formatCurrency } from "../utils/subscriptionHelpers";
import { statCardClass } from "../utils/styles";

const BudgetBar = ({ budgetStatus }) => {
  if (!budgetStatus) return null;

  const { budget, spent, percentUsed, overBudget, remaining } = budgetStatus;

  return (
    <div className={`mb-6 ${statCardClass}`}>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-stone-500">Monthly budget</span>
        <span className={overBudget ? "text-rose-400" : "text-orange-300"}>
          {formatCurrency(spent)} / {formatCurrency(budget)}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-stone-800">
        <div
          className={`h-full rounded-full ${overBudget ? "bg-rose-500" : "bg-gradient-to-r from-orange-500 to-rose-500"}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-stone-500">
        {overBudget
          ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
          : `${formatCurrency(remaining)} remaining`}
      </p>
    </div>
  );
};

export default BudgetBar;
