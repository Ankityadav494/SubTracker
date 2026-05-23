export const inputClass =
  "w-full min-w-0 rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-base text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:px-4";

export const selectClass =
  "w-full min-w-0 rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-base text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:px-4";

export const btnPrimaryClass =
  "w-full min-h-[44px] rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base";

export const btnSecondaryClass =
  "min-h-[44px] rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-800";

export const cardClass =
  "rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-lg shadow-sky-900/5 backdrop-blur-md sm:p-6";

export const statCardClass =
  "rounded-2xl border border-sky-100 bg-white/95 p-3 shadow-md shadow-sky-900/5 sm:p-4";

export const pageClass =
  "mx-auto w-full max-w-6xl px-3 pt-4 pb-12 sm:px-4 sm:pt-6 sm:pb-16";

export const pageWithChatbotClass = `${pageClass} page-with-chatbot`;

export const formPageClass =
  "mx-auto w-full max-w-2xl px-3 pb-16 pt-4 sm:px-4 sm:pt-8";

export const headingClass =
  "bg-gradient-to-r from-sky-700 via-blue-600 to-cyan-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl lg:text-4xl";

export const subheadingClass = "text-base font-semibold text-slate-800 sm:text-lg";

export const labelClass =
  "mb-1.5 block text-left text-sm font-medium text-slate-600";

export const errorClass =
  "rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700";

export const linkClass =
  "font-medium text-sky-600 transition hover:text-blue-700";

export const mutedClass = "text-sm text-slate-500";

export const navLinkClass = ({ isActive }) =>
  `rounded-xl px-2.5 py-2 text-sm font-medium transition sm:px-3 ${
    isActive
      ? "bg-sky-100 text-sky-800 ring-1 ring-sky-200"
      : "text-slate-600 hover:bg-sky-50 hover:text-sky-900"
  }`;

export const mobileNavLinkClass = ({ isActive }) =>
  `block min-h-[44px] rounded-xl px-4 py-3 text-base font-medium transition ${
    isActive
      ? "bg-sky-100 text-sky-800 ring-1 ring-sky-200"
      : "text-slate-700 hover:bg-sky-50 hover:text-sky-900"
  }`;

export const btnSignupClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:from-sky-400 hover:to-blue-500";
