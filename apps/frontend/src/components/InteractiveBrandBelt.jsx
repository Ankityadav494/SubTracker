import { useState } from "react";
import BrandLogo from "./BrandLogo";
import { formatCurrency, monthlyEquivalent } from "../utils/subscriptionHelpers";

const InteractiveBrandBelt = ({ subscriptions }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const activeSubs = subscriptions.filter((s) => s.status === "active");

  if (activeSubs.length === 0) return null;

  const handleScrollToCard = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-4", "ring-orange-500/50", "scale-[1.02]");
      setTimeout(() => {
        el.classList.remove("ring-4", "ring-orange-500/50", "scale-[1.02]");
      }, 1500);
    }
  };

  return (
    <div className="relative mb-8 w-full overflow-hidden rounded-3xl border border-stone-800/80 bg-gradient-to-br from-stone-900/90 to-stone-950 p-6 shadow-xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              Your platforms
            </h3>
            <p className="text-xs text-stone-500">Tap a logo to jump to its card</p>
          </div>
          <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-300">
            {activeSubs.length} active
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 py-4">
          {activeSubs.map((sub, index) => {
            const monthly = monthlyEquivalent(sub.price, sub.billingCycle);
            const delay = `${(index * 200) % 1000}ms`;

            return (
              <div
                key={sub._id}
                onClick={() => handleScrollToCard(sub._id)}
                className="group/bubble relative cursor-pointer select-none"
                style={{
                  animation: "sub-drift 4s ease-in-out infinite alternate",
                  animationDelay: delay,
                }}
                onMouseEnter={() => setHoveredId(sub._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="pointer-events-none absolute inset-0 scale-110 rounded-2xl bg-orange-500/0 blur-md transition-all duration-300 group-hover/bubble:bg-orange-500/25" />
                <BrandLogo
                  name={sub.name}
                  category={sub.category}
                  size="lg"
                  className="transition-transform duration-300 group-hover/bubble:scale-125"
                />
                {hoveredId === sub._id && (
                  <div className="absolute -top-16 left-1/2 z-30 min-w-[140px] -translate-x-1/2 whitespace-nowrap rounded-2xl border border-stone-700 bg-stone-900 px-3 py-2 text-center shadow-2xl">
                    <p className="text-xs font-bold text-stone-100">{sub.name}</p>
                    <p className="text-[10px] font-semibold text-orange-400">
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
