import { useState } from "react";
import BrandLogo from "./BrandLogo";
import { formatCurrency, monthlyEquivalent } from "../utils/subscriptionHelpers";
import { cardClass } from "../utils/styles";

const InteractiveBrandBelt = ({ subscriptions }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const activeSubs = subscriptions.filter((s) => s.status === "active");

  if (activeSubs.length === 0) return null;

  const handleScrollToCard = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-4", "ring-sky-500/50", "scale-[1.02]");
      setTimeout(() => {
        el.classList.remove("ring-4", "ring-sky-500/50", "scale-[1.02]");
      }, 1500);
    }
  };

  return (
    <div className={`relative mb-6 w-full min-w-0 overflow-hidden sm:mb-8 ${cardClass}`}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-sky-400/15 blur-3xl sm:h-60 sm:w-60" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-400/15 blur-3xl sm:h-60 sm:w-60" />

      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-600 sm:text-sm">
              Your platforms
            </h3>
            <p className="text-xs text-slate-500">Tap a logo to jump to its card</p>
          </div>
          <span className="shrink-0 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
            {activeSubs.length} active
          </span>
        </div>

        <div className="scrollbar-thin -mx-1 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-3 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-6 sm:overflow-visible sm:px-0">
          {activeSubs.map((sub, index) => {
            const monthly = monthlyEquivalent(sub.price, sub.billingCycle);
            const delay = `${(index * 200) % 1000}ms`;

            return (
              <div
                key={sub._id}
                onClick={() => handleScrollToCard(sub._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleScrollToCard(sub._id);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group/bubble relative shrink-0 snap-center cursor-pointer select-none"
                style={{
                  animation: "sub-drift 4s ease-in-out infinite alternate",
                  animationDelay: delay,
                }}
                onMouseEnter={() => setHoveredId(sub._id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(sub._id)}
                onBlur={() => setHoveredId(null)}
              >
                <div className="pointer-events-none absolute inset-0 scale-110 rounded-2xl bg-sky-500/0 blur-md transition-all duration-300 group-hover/bubble:bg-sky-500/20" />
                <BrandLogo
                  name={sub.name}
                  category={sub.category}
                  size="lg"
                  className="transition-transform duration-300 group-hover/bubble:scale-110 sm:group-hover/bubble:scale-125"
                />
                {hoveredId === sub._id && (
                  <div className="absolute -top-14 left-1/2 z-30 max-w-[min(160px,70vw)] -translate-x-1/2 rounded-2xl border border-sky-100 bg-white px-3 py-2 text-center shadow-2xl shadow-sky-900/10 sm:-top-16 sm:min-w-[140px]">
                    <p className="truncate text-xs font-bold text-slate-800">{sub.name}</p>
                    <p className="text-[10px] font-semibold text-sky-600">
                      {formatCurrency(monthly)}/mo
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InteractiveBrandBelt;
