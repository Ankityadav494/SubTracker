import { formatCurrency } from "../utils/subscriptionHelpers";
import { statCardClass } from "../utils/styles";

const statAccents = [
  "from-orange-500/20 to-transparent border-orange-500/20",
  "from-rose-500/20 to-transparent border-rose-500/20",
  "from-amber-500/20 to-transparent border-amber-500/20",
  "from-emerald-500/20 to-transparent border-emerald-500/20",
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
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`${statCardClass} border bg-gradient-to-br ${statAccents[i % statAccents.length]}`}
        >
          <p className="text-sm text-stone-400">{stat.label}</p>
          <p className="mt-1 text-2xl font-bold text-stone-50">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
