import { statCardClass, subheadingClass, mutedClass } from "../utils/styles";

const CalendarView = ({ subscriptions }) => {
  const sorted = [...subscriptions].sort(
    (a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate)
  );

  const daysUntil = (date) => {
    const days = Math.ceil(
      (new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (days < 0) return "Past due";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  };

  return (
    <div className={`${statCardClass} min-w-0`}>
      <h3 className={`mb-4 text-left ${subheadingClass}`}>Upcoming renewals</h3>
      <ul className="max-h-80 space-y-2 overflow-y-auto sm:max-h-none sm:space-y-3">
        {sorted.map((sub) => (
          <li
            key={sub._id}
            className="flex items-center justify-between gap-2 rounded-xl border border-sky-100 bg-sky-50/50 px-3 py-2.5 transition hover:border-sky-300 sm:gap-4 sm:px-4 sm:py-3"
          >
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate font-medium text-slate-800">{sub.name}</p>
              <p className={`truncate text-xs ${mutedClass}`}>{sub.category}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-sky-700 sm:text-sm">
                {new Date(sub.nextBillingDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <p className="text-[10px] font-medium text-blue-600 sm:text-xs">
                {daysUntil(sub.nextBillingDate)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarView;
