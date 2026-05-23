import { useEffect, useState } from "react";
import { getReminders } from "../services/remindersService";
import { statCardClass } from "../utils/styles";

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
        className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"
        aria-label="Reminders"
        aria-expanded={open}
      >
        🔔
        {reminders.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-[10px] font-bold text-white">
            {reminders.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div
            className={`fixed left-3 right-3 top-16 z-50 max-h-[min(70vh,400px)] overflow-hidden p-3 shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 sm:max-h-none ${statCardClass}`}
          >
            <p className="mb-2 text-xs font-semibold uppercase text-sky-600">
              Upcoming renewals
            </p>
            {reminders.length === 0 ? (
              <p className="text-sm text-slate-500">No renewals soon</p>
            ) : (
              <ul className="scrollbar-thin max-h-48 space-y-2 overflow-y-auto sm:max-h-48">
                {reminders.map((r) => (
                  <li
                    key={r._id}
                    className="rounded-lg border border-sky-100 bg-sky-50/50 px-3 py-2 text-sm"
                  >
                    <p className="truncate font-medium text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-500">
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
