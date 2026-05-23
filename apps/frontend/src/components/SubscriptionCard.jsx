import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { formatDate } from "../utils/dateUtils";
import { formatCurrency, monthlyEquivalent } from "../utils/subscriptionHelpers";
import { statCardClass } from "../utils/styles";

const categoryColors = {
  OTT: "bg-pink-100 text-pink-700 ring-pink-200",
  Music: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  Gaming: "bg-violet-100 text-violet-700 ring-violet-200",
  Software: "bg-rose-100 text-rose-700 ring-rose-200",
  Education: "bg-amber-100 text-amber-700 ring-amber-200",
  Others: "bg-slate-100 text-slate-600 ring-slate-200",
};

const statusColors = {
  active: "text-emerald-600",
  paused: "text-amber-600",
  cancelled: "text-slate-400",
};

const SubscriptionCard = ({ sub, onDelete }) => {
  const monthly = monthlyEquivalent(sub.price, sub.billingCycle);
  const priceChange =
    sub.priceHistory?.length > 1
      ? sub.priceHistory[sub.priceHistory.length - 1].price -
        sub.priceHistory[sub.priceHistory.length - 2].price
      : 0;

  return (
    <div
      id={sub._id}
      className={`group flex w-full min-w-0 flex-col overflow-hidden ${statCardClass} transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/10`}
    >
      <div className="flex items-start gap-3 p-4 sm:gap-4 sm:p-5">
        <BrandLogo name={sub.name} category={sub.category} size="md" className="sm:hidden" />
        <BrandLogo name={sub.name} category={sub.category} size="lg" className="hidden sm:flex" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
            <Link
              to={`/edit/${sub._id}`}
              className="truncate text-base font-semibold text-slate-800 transition group-hover:text-sky-700 sm:text-lg"
            >
              {sub.name}
            </Link>
            <span
              className={`w-fit shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${categoryColors[sub.category] || categoryColors.Others}`}
            >
              {sub.category}
            </span>
          </div>

          <p className="mt-2 text-xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text sm:text-2xl">
            {formatCurrency(sub.price)}
            <span className="text-sm font-normal text-slate-500"> / {sub.billingCycle}</span>
          </p>
          <p className="text-xs text-slate-500 sm:text-sm">≈ {formatCurrency(monthly)}/month</p>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className={statusColors[sub.status] || statusColors.active}>{sub.status}</span>
            {priceChange !== 0 && (
              <span className={priceChange > 0 ? "text-red-600" : "text-emerald-600"}>
                {priceChange > 0 ? "↑" : "↓"} {formatCurrency(Math.abs(priceChange))}
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            Renews{" "}
            <span className="font-medium text-slate-700">{formatDate(sub.nextBillingDate)}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-t border-sky-100 bg-sky-50/50 p-3">
        <Link
          to={`/edit/${sub._id}`}
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-sky-200 text-center text-sm text-slate-600 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-800"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm text-red-600 transition hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
