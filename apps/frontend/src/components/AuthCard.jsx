import BrandStrip from "./BrandStrip";
import AppLogo from "./AppLogo";
import { cardClass, headingClass, mutedClass } from "../utils/styles";

const AuthCard = ({ title, subtitle, children, footer, showBrands = true }) => (
  <div className="safe-top safe-bottom flex w-full flex-1 items-center justify-center overflow-y-auto overflow-x-clip px-3 py-4 sm:px-4 sm:py-6 md:min-h-0">
    <div
      className={`flex w-full max-w-6xl flex-col items-stretch gap-4 sm:gap-6 ${
        showBrands ? "md:flex-row md:gap-8" : "justify-center"
      }`}
    >
      {showBrands && (
        <>
          <aside className="hidden min-h-[280px] min-w-0 flex-1 md:flex lg:min-h-[360px]">
            <BrandStrip variant="grid" />
          </aside>
          <div className="w-full shrink-0 md:hidden">
            <BrandStrip variant="scroll" />
          </div>
        </>
      )}

      <div
        className={`relative flex w-full min-w-0 flex-col justify-center ${cardClass} ${
          showBrands ? "md:max-w-md md:shrink-0 lg:max-w-lg" : "mx-auto max-w-md"
        }`}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-400/15 blur-3xl sm:h-40 sm:w-40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-blue-400/15 blur-3xl sm:h-32 sm:w-32"
          aria-hidden
        />

        <header className="relative mb-4 shrink-0 text-center sm:mb-5">
          <AppLogo
            to="/login"
            className="inline-flex justify-center"
            textClassName="text-lg font-bold sm:text-2xl"
            size="md"
          />
          <h1 className={`mt-3 ${headingClass}`}>{title}</h1>
          {subtitle && (
            <p className={`mt-1.5 text-xs sm:text-sm ${mutedClass}`}>{subtitle}</p>
          )}
        </header>

        <div className="relative min-h-0 w-full shrink-0">{children}</div>

        {footer && (
          <footer
            className={`relative mt-4 shrink-0 border-t border-sky-100 pt-4 text-center text-xs sm:mt-5 sm:text-sm ${mutedClass}`}
          >
            {footer}
          </footer>
        )}
      </div>
    </div>
  </div>
);

export default AuthCard;
