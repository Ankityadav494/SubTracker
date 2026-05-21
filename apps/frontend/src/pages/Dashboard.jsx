import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import SubscriptionCard from "../components/SubscriptionCard";
import Chart from "../components/Chart";
import CalendarView from "../components/CalendarView";
import DashboardStats from "../components/DashboardStats";
import BudgetBar from "../components/BudgetBar";
import SubscriptionFilters from "../components/SubscriptionFilters";
import SpendingTrendChart from "../components/SpendingTrendChart";
import SavingsCard from "../components/SavingsCard";
import SpendBreakdown from "../components/SpendBreakdown";
import TemplatePicker from "../components/TemplatePicker";
import ConfirmModal from "../components/ConfirmModal";
import InteractiveBrandBelt from "../components/InteractiveBrandBelt";
import { getSubscriptions, deleteSubscription } from "../services/subscriptionService";
import { getOverview, getTrends, getSavings } from "../services/analyticsService";
import { headingClass, pageClass } from "../utils/styles";

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [savings, setSavings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    sort: "date",
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v)
      );
      const [subs, ov, tr, sv] = await Promise.all([
        getSubscriptions(params),
        getOverview(),
        getTrends(),
        getSavings(),
      ]);
      setSubscriptions(subs);
      setOverview(ov);
      setTrends(tr);
      setSavings(sv);
      setError("");
    } catch {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(fetchAll, filters.search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchAll, filters]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSubscription(deleteTarget._id);
      toast.success(`Removed ${deleteTarget.name}`);
      setDeleteTarget(null);
      fetchAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleTemplate = (template) => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    window.location.href = `/add?${new URLSearchParams({
      name: template.name,
      price: String(template.price),
      category: template.category,
      billingCycle: template.billingCycle,
      nextBillingDate: date.toISOString().split("T")[0],
    })}`;
  };

  return (
    <Layout>
      <Navbar />
      <main className={pageClass}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className={headingClass}>Dashboard</h1>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/add"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-orange-900/40 hover:from-orange-400 hover:to-rose-400"
            >
              + Add
            </Link>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-stone-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            Loading...
          </div>
        )}

        {error && <p className="mb-4 text-rose-300">{error}</p>}

        {!loading && overview && (
          <>
            <DashboardStats overview={overview} />
            <BudgetBar budgetStatus={overview.budgetStatus} />
            <SavingsCard savings={savings} />
          </>
        )}

        {!loading && subscriptions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-700 px-6 py-12">
            <TemplatePicker onSelect={handleTemplate} />
            <p className="text-stone-500">Or add a custom subscription manually.</p>
            <Link to="/add" className="mt-4 inline-block font-medium text-orange-400 hover:text-orange-300">
              Add subscription →
            </Link>
          </div>
        )}

        {!loading && subscriptions.length > 0 && (
          <>
            <InteractiveBrandBelt subscriptions={subscriptions} />
            <SubscriptionFilters filters={filters} onChange={setFilters} />

            <section className="mb-8">
              <h2 className="mb-4 text-left text-lg font-semibold text-stone-100">
                Subscriptions
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subscriptions.map((sub) => (
                  <SubscriptionCard
                    key={sub._id}
                    sub={sub}
                    onDelete={() => setDeleteTarget(sub)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Chart subscriptions={subscriptions.filter((s) => s.status === "active")} />
              <SpendBreakdown breakdown={overview?.breakdown} />
            </section>

            <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SpendingTrendChart trends={trends} />
              <CalendarView subscriptions={subscriptions} />
            </section>
          </>
        )}
      </main>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete subscription?"
        message={`Remove ${deleteTarget?.name}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Layout>
  );
};

export default Dashboard;
