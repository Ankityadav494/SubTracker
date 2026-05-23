import { formatCurrency } from "../utils/subscriptionHelpers";
import { statCardClass, mutedClass } from "../utils/styles";

const statAccents = [
  "from-sky-500/15 to-transparent border-sky-200",
  "from-blue-500/15 to-transparent border-blue-200",
  "from-cyan-500/15 to-transparent border-cyan-200",
  "from-emerald-500/15 to-transparent border-emerald-200",
];

const DashboardStats = ({ overview }) => {
  if (!overview) return null;

  const stats = [
    { label: "Active subscriptions", value: overview.activeCount },
    { label: "Monthly spend", value: formatCurrency(overview.totalMonthly) },
    { label: "Yearly projection", value: formatCurrency(overview.totalYearly) },
    {
      label: "Top category",
      value: overview.breakdown?.[0]
        ? `${overview.breakdown[0].name} (${overview.breakdown[0].percentOfTotal}%)`
        : "—",
      truncate: true,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`${statCardClass} min-w-0 border bg-gradient-to-br ${statAccents[i % statAccents.length]}`}
        >
          <p className={`text-xs sm:text-sm ${mutedClass}`}>{stat.label}</p>
          <p
            className={`mt-1 text-xl font-bold text-slate-800 sm:text-2xl ${
              stat.truncate ? "truncate" : ""
            }`}
            title={stat.truncate ? String(stat.value) : undefined}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
