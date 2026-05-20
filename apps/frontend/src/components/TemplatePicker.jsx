import BrandLogo from "./BrandLogo";
import { SUBSCRIPTION_TEMPLATES } from "../utils/templates";
import { formatCurrency, monthlyEquivalent } from "../utils/subscriptionHelpers";

const TemplatePicker = ({ onSelect }) => (
  <div className="mb-6">
    <p className="mb-4 text-sm font-medium text-stone-400">
      Quick add — tap a platform
    </p>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {SUBSCRIPTION_TEMPLATES.map((t) => (
        <button
          key={t.name}
          type="button"
          onClick={() => onSelect(t)}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-stone-800 bg-stone-900/60 p-4 text-center transition hover:-translate-y-1 hover:border-orange-500/50 hover:bg-stone-800/80 hover:shadow-lg hover:shadow-orange-900/20"
        >
          <BrandLogo
            name={t.name}
            slug={t.slug}
            brandColor={t.brandColor}
            size="md"
            className="transition group-hover:scale-110"
          />
          <span className="text-sm font-medium text-stone-200 group-hover:text-orange-200">
            {t.name}
          </span>
          <span className="text-xs text-stone-500">
            {formatCurrency(monthlyEquivalent(t.price, t.billingCycle))}/mo
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default TemplatePicker;
