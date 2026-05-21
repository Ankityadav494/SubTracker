import BrandStrip from "./BrandStrip";
import AppLogo from "./AppLogo";
import { cardClass, headingClass } from "../utils/styles";

const AuthCard = ({ title, subtitle, children, footer, showBrands = true }) => (
  <div className="flex h-svh max-h-svh w-full items-center justify-center overflow-hidden px-4 py-4">
    <div
      className={`flex h-full max-h-[min(720px,94vh)] w-full max-w-6xl items-stretch gap-4 sm:gap-8 ${
        showBrands ? "flex-row" : "flex-row justify-center"
      }`}
    >
      {showBrands && (
        <aside className="flex min-h-0 min-w-0 flex-[1.35] basis-0 items-stretch">
          <BrandStrip variant="grid" />
        </aside>
      )}

      <div
        className={`flex min-h-0 min-w-0 shrink-0 flex-col justify-center overflow-hidden !p-4 sm:!p-5 ${
          showBrands ? "w-full max-w-[22rem] sm:max-w-sm" : "w-full max-w-md"
        } ${cardClass}`}
      >
        <header className="mb-4 shrink-0 text-center">
          <AppLogo
            to="/"
            className="inline-flex justify-center"
            textClassName="text-xl font-bold sm:text-2xl"
            size="lg"
          />
          <h1 className={`mt-2 ${headingClass} text-xl sm:text-2xl`}>{title}</h1>
          {subtitle && <p className="mt-1 text-xs text-stone-500 sm:text-sm">{subtitle}</p>}
        </header>

        <div className="min-h-0 w-full shrink-0">{children}</div>

        {footer && (
          <footer className="mt-4 shrink-0 border-t border-stone-800 pt-4 text-center text-xs text-stone-500 sm:text-sm">
            {footer}
          </footer>
        )}
      </div>
    </div>
  </div>
);

export default AuthCard;
