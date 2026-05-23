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
  onClick,
}) => {
  const inner = (
    <>
      <img
        src={logo}
        alt="SubTracker"
        className={`${imgSizes[size]} shrink-0 rounded-xl object-cover shadow-md ring-2 ring-sky-100`}
      />
      {showText && (
        <span
          className={`bg-gradient-to-r from-sky-700 to-blue-600 bg-clip-text text-transparent ${textClassName}`}
        >
          SubTracker
        </span>
      )}
    </>
  );

  const wrapClass = `flex items-center gap-2.5 ${className}`;

  if (to) {
    return (
      <Link to={to} className={wrapClass} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return <div className={wrapClass}>{inner}</div>;
};

export default AppLogo;
