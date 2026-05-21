import { statCardClass, subheadingClass } from "../utils/styles";

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
    <div className={statCardClass}>
      <h3 className={`mb-4 text-left ${subheadingClass}`}>Upcoming renewals</h3>
      <ul className="space-y-3">
        {sorted.map((sub) => (
          <li
            key={sub._id}
            className="flex items-center justify-between gap-4 rounded-xl border border-stone-700/80 bg-stone-800/40 px-4 py-3 transition hover:border-orange-500/40"
          >
            <div className="text-left">
              <p className="font-medium text-stone-100">{sub.name}</p>
              <p className="text-xs text-stone-500">{sub.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-orange-300">
                {new Date(sub.nextBillingDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <p className="text-xs font-medium text-rose-400">{daysUntil(sub.nextBillingDate)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarView;
