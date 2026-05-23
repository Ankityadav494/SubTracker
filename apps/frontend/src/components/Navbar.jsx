import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AppLogo from "./AppLogo";
import ReminderBell from "./ReminderBell";
import { btnSignupClass, mobileNavLinkClass, navLinkClass } from "../utils/styles";

const HamburgerIcon = ({ open }) => (
  <span className="relative flex h-6 w-6 flex-col items-center justify-center gap-1.5">
    <span
      className={`block h-0.5 w-5 rounded-full bg-slate-600 transition-all duration-300 ${
        open ? "translate-y-2 rotate-45" : ""
      }`}
    />
    <span
      className={`block h-0.5 w-5 rounded-full bg-slate-600 transition-all duration-300 ${
        open ? "opacity-0" : ""
      }`}
    />
    <span
      className={`block h-0.5 w-5 rounded-full bg-slate-600 transition-all duration-300 ${
        open ? "-translate-y-2 -rotate-45" : ""
      }`}
    />
  </span>
);

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    closeMenu();
    navigate("/login");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-sky-100 bg-white/90 backdrop-blur-xl shadow-sm shadow-sky-900/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
          <AppLogo to="/" onClick={closeMenu} />

          <div className="hidden items-center gap-1 sm:flex sm:gap-2">
            {user && (
              <>
                <NavLink to="/" end className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/add" className={navLinkClass}>Add</NavLink>
                <NavLink to="/household" className={navLinkClass}>Household</NavLink>
                <NavLink to="/settings" className={navLinkClass}>Settings</NavLink>
                <ReminderBell />
              </>
            )}

            {!user ? (
              <>
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink to="/signup" className={btnSignupClass}>
                  Sign up
                </NavLink>
              </>
            ) : (
              <div className="ml-2 flex items-center gap-3 border-l border-sky-200 pl-3">
                <span className="hidden max-w-[8rem] truncate text-sm text-slate-600 md:inline lg:max-w-[12rem]">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            {user && <ReminderBell />}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl p-2 text-slate-600 hover:bg-sky-50 transition"
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out sm:hidden ${
            menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-sky-100 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-xl">
            {user ? (
              <>
                <div className="mb-3 border-b border-sky-100 pb-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                    Signed in as
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800">{user.name}</p>
                </div>
                <nav className="flex flex-col gap-1">
                  <NavLink to="/" end className={mobileNavLinkClass} onClick={closeMenu}>Dashboard</NavLink>
                  <NavLink to="/add" className={mobileNavLinkClass} onClick={closeMenu}>Add Subscription</NavLink>
                  <NavLink to="/household" className={mobileNavLinkClass} onClick={closeMenu}>Household</NavLink>
                  <NavLink to="/settings" className={mobileNavLinkClass} onClick={closeMenu}>Settings</NavLink>
                </nav>
                <div className="mt-3 border-t border-sky-100 pt-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-700 hover:bg-red-100 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <nav className="flex flex-col gap-2 py-2">
                <NavLink to="/login" className={mobileNavLinkClass} onClick={closeMenu}>Login</NavLink>
                <NavLink to="/signup" onClick={closeMenu} className={`${btnSignupClass} block py-3 text-center`}>
                  Sign up
                </NavLink>
              </nav>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
