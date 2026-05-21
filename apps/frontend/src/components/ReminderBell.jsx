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
        className="relative rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-orange-300"
        aria-label="Reminders"
      >
        🔔
        {reminders.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-[10px] font-bold text-white">
            {reminders.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-stone-700 bg-stone-900 p-3 shadow-xl">
            <p className="mb-2 text-xs font-semibold uppercase text-orange-400">
              Upcoming renewals
            </p>
            {reminders.length === 0 ? (
              <p className="text-sm text-stone-500">No renewals soon</p>
            ) : (
              <ul className="max-h-48 space-y-2 overflow-y-auto">
                {reminders.map((r) => (
                  <li key={r._id} className="rounded-lg border border-stone-700 bg-stone-800/50 px-3 py-2 text-sm">
                    <p className="font-medium text-stone-100">{r.name}</p>
                    <p className="text-xs text-stone-500">
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
