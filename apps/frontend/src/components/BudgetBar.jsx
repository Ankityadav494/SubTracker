import { formatCurrency } from "../utils/subscriptionHelpers";

const BudgetBar = ({ budgetStatus }) => {
  if (!budgetStatus) return null;

  const { budget, spent, percentUsed, overBudget, remaining } = budgetStatus;

  return (
    <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-400">Monthly budget</span>
        <span className={overBudget ? "text-red-400" : "text-slate-300"}>
          {formatCurrency(spent)} / {formatCurrency(budget)}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${overBudget ? "bg-red-500" : "bg-gradient-to-r from-orange-500 to-rose-500"}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>
      <p className={`mt-2 text-xs ${overBudget ? "text-red-400" : "text-slate-500"}`}>
        {overBudget
          ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
          : `${formatCurrency(remaining)} remaining`}
      </p>
    </div>
  );
};

export default BudgetBar;
