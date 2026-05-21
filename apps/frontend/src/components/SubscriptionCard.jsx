import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { formatDate } from "../utils/dateUtils";
import { formatCurrency, monthlyEquivalent } from "../utils/subscriptionHelpers";

const categoryColors = {
  OTT: "bg-pink-500/20 text-pink-300 ring-pink-500/30",
  Music: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
  Gaming: "bg-fuchsia-500/20 text-fuchsia-300 ring-fuchsia-500/30",
  Software: "bg-rose-500/20 text-rose-300 ring-rose-500/30",
  Education: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
  Others: "bg-stone-500/20 text-stone-300 ring-stone-500/30",
};

const statusColors = {
  active: "text-emerald-400",
  paused: "text-amber-400",
  cancelled: "text-stone-500",
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
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-stone-800/80 bg-gradient-to-br from-stone-900/90 to-stone-950 shadow-lg transition hover:-translate-y-0.5 hover:border-orange-500/40 hover:shadow-orange-900/20"
    >
      <div className="flex items-start gap-4 p-5">
        <BrandLogo name={sub.name} category={sub.category} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/edit/${sub._id}`}
              className="truncate text-lg font-semibold text-white transition group-hover:text-orange-300"
            >
              {sub.name}
            </Link>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${categoryColors[sub.category] || categoryColors.Others}`}
            >
              {sub.category}
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-300 to-rose-300 bg-clip-text">
            {formatCurrency(sub.price)}
            <span className="text-sm font-normal text-stone-500"> / {sub.billingCycle}</span>
          </p>
          <p className="text-sm text-stone-400">≈ {formatCurrency(monthly)}/month</p>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className={statusColors[sub.status] || statusColors.active}>{sub.status}</span>
            {priceChange !== 0 && (
              <span className={priceChange > 0 ? "text-rose-400" : "text-emerald-400"}>
                {priceChange > 0 ? "↑" : "↓"} {formatCurrency(Math.abs(priceChange))}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-stone-500">
            Renews <span className="font-medium text-stone-300">{formatDate(sub.nextBillingDate)}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-t border-stone-800/80 bg-stone-950/50 p-3">
        <Link
          to={`/edit/${sub._id}`}
          className="flex-1 rounded-xl border border-stone-700 py-2 text-center text-sm text-stone-300 transition hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-200"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="flex-1 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
