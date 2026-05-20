import { useEffect, useState } from "react";
import { getReminders } from "../services/remindersService";

const ReminderBell = () => {
  const [reminders, setReminders] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getReminders().then(setReminders).catch(() => {});
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-slate-300 hover:bg-slate-800"
        aria-label="Reminders"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {reminders.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-[10px] font-bold text-white">
            {reminders.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Upcoming renewals</p>
            {reminders.length === 0 ? (
              <p className="text-sm text-slate-500">No renewals soon</p>
            ) : (
              <ul className="max-h-48 space-y-2 overflow-y-auto">
                {reminders.map((r) => (
                  <li key={r._id} className="rounded-lg bg-slate-800/60 px-3 py-2 text-sm">
                    <p className="font-medium text-white">{r.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(r.nextBillingDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReminderBell;
