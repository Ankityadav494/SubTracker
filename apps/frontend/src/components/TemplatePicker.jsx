import BrandLogo from "./BrandLogo";
import { SUBSCRIPTION_TEMPLATES } from "../utils/templates";
import { formatCurrency, monthlyEquivalent } from "../utils/subscriptionHelpers";

const templateTileClass =
  "rounded-xl border border-sky-100 bg-white shadow-md shadow-sky-900/5 sm:rounded-2xl";

const TemplatePicker = ({ onSelect }) => (
  <section className="w-full min-w-0">
    <p className="mb-3 text-center text-sm font-medium text-sky-600 sm:mb-4 sm:text-left">
      Quick add — tap a platform
    </p>
    <div className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-3 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {SUBSCRIPTION_TEMPLATES.map((t) => (
        <button
          key={t.name}
          type="button"
          onClick={() => onSelect(t)}
          className={`group flex min-h-[7.5rem] w-full min-w-0 flex-col items-center justify-center gap-1.5 px-1.5 py-3 text-center transition hover:border-sky-300 hover:bg-sky-50 hover:shadow-lg hover:shadow-sky-500/10 sm:min-h-[8.5rem] sm:gap-2 sm:px-2 sm:py-4 md:min-h-[9rem] ${templateTileClass}`}
        >
          <BrandLogo
            name={t.name}
            slug={t.slug}
            brandColor={t.brandColor}
            size="md"
            className="transition group-hover:scale-110 sm:hidden"
          />
          <BrandLogo
            name={t.name}
            slug={t.slug}
            brandColor={t.brandColor}
            size="lg"
            className="hidden transition group-hover:scale-110 sm:block"
          />
          <span className="line-clamp-2 w-full text-[11px] font-medium leading-tight text-slate-700 group-hover:text-sky-700 sm:text-xs md:text-sm">
            {t.name}
          </span>
          <span className="text-[10px] text-slate-500 sm:text-xs">
            {formatCurrency(monthlyEquivalent(t.price, t.billingCycle))}/mo
          </span>
        </button>
      ))}
    </div>
  </section>
);

export default TemplatePicker;
