import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const imgSizes = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-11 w-11",
};

const AppLogo = ({
  to = "/",
  className = "",
  showText = true,
  size = "md",
  textClassName = "text-xl font-bold tracking-tight",
}) => {
  const inner = (
    <>
      <img
        src={logo}
        alt="SubTracker"
        className={`${imgSizes[size]} shrink-0 rounded-xl object-cover shadow-md ring-1 ring-stone-700/60`}
      />
      {showText && (
        <span
          className={`bg-gradient-to-r from-orange-300 to-rose-300 bg-clip-text text-transparent ${textClassName}`}
        >
          SubTracker
        </span>
      )}
    </>
  );

  const wrapClass = `flex items-center gap-2.5 ${className}`;

  if (to) {
    return (
      <Link to={to} className={wrapClass}>
        {inner}
      </Link>
    );
  }

  return <div className={wrapClass}>{inner}</div>;
};

export default AppLogo;
