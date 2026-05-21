import BrandLogo from "./BrandLogo";
import { SUBSCRIPTION_TEMPLATES } from "../utils/templates";
import { formatCurrency, monthlyEquivalent } from "../utils/subscriptionHelpers";

const TemplatePicker = ({ onSelect }) => (
  <section className="-mx-1 w-full sm:-mx-2">
    <p className="mb-4 text-center text-sm font-medium text-orange-400 sm:text-left">
      Quick add — tap a platform
    </p>
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {SUBSCRIPTION_TEMPLATES.map((t) => (
        <button
          key={t.name}
          type="button"
          onClick={() => onSelect(t)}
          className="group flex min-h-[8.5rem] w-full flex-col items-center justify-center gap-2.5 rounded-2xl border border-stone-700 bg-stone-800/60 px-2 py-4 text-center transition hover:border-orange-500/50 hover:bg-stone-800 hover:shadow-lg hover:shadow-orange-900/20 sm:min-h-[9rem] sm:px-3"
        >
          <BrandLogo
            name={t.name}
            slug={t.slug}
            brandColor={t.brandColor}
            size="lg"
            className="transition group-hover:scale-110"
          />
          <span className="line-clamp-2 w-full text-xs font-medium leading-tight text-stone-100 group-hover:text-orange-300 sm:text-sm">
            {t.name}
          </span>
          <span className="text-[10px] text-stone-500 sm:text-xs">
            {formatCurrency(monthlyEquivalent(t.price, t.billingCycle))}/mo
          </span>
        </button>
      ))}
    </div>
  </section>
);

export default TemplatePicker;
