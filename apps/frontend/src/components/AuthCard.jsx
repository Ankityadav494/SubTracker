import { Link } from "react-router-dom";
import BrandStrip from "./BrandStrip";
import { cardClass, headingClass } from "../utils/styles";

const AuthCard = ({ title, subtitle, children, footer, showBrands = true }) => (
  <div className="flex min-h-svh flex-col items-center justify-center px-4 py-12">
    {showBrands && <BrandStrip />}
    <div className={`w-full max-w-md ${cardClass}`}>
      <div className="mb-8 text-center">
        <Link
          to="/"
          className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-2xl font-bold text-transparent"
        >
          SubTracker
        </Link>
        <h1 className={`mt-4 ${headingClass} text-2xl sm:text-3xl`}>{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {children}
      {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
    </div>
  </div>
);

export default AuthCard;
