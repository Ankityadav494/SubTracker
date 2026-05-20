import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ReminderBell from "./ReminderBell";

const navLinkClass = ({ isActive }) =>
  `rounded-xl px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30"
      : "text-stone-400 hover:bg-stone-800 hover:text-stone-100"
  }`;

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-800/80 bg-stone-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-lg shadow-lg shadow-orange-900/40">
            ₹
          </span>
          <span className="bg-gradient-to-r from-orange-300 to-rose-300 bg-clip-text text-transparent">
            SubTracker
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {user && (
            <>
              <NavLink to="/" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/add" className={navLinkClass}>
                Add
              </NavLink>
              <NavLink to="/household" className={navLinkClass}>
                Household
              </NavLink>
              <NavLink to="/settings" className={navLinkClass}>
                Settings
              </NavLink>
              <ReminderBell />
            </>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-900/30 hover:from-orange-400 hover:to-rose-400"
              >
                Sign up
              </NavLink>
            </>
          ) : (
            <div className="ml-2 flex items-center gap-3 border-l border-stone-800 pl-3">
              <span className="hidden text-sm text-stone-400 sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-stone-800 px-3 py-2 text-sm font-medium text-stone-300 ring-1 ring-stone-700 hover:bg-rose-950 hover:text-rose-300 hover:ring-rose-500/40"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
