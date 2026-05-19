import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SubscriptionCard from "../components/SubscriptionCard";
import Chart from "../components/Chart";
import CalendarView from "../components/CalendarView";
import { getSubscriptions, deleteSubscription } from "../services/subscriptionService";

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptions();
      setSubscriptions(data);
      setError("");
    } catch (err) {
      setError("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubscription(id);
      fetchSubscriptions();
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Dashboard</h1>

      {/* Loading */}
      {loading && <p>Loading subscriptions...</p>}

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Empty State */}
      {!loading && subscriptions.length === 0 && (
        <p>No subscriptions found. Add one 🚀</p>
      )}

      {/* Data */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {subscriptions.map((sub) => (
          <SubscriptionCard
            key={sub._id}
            sub={sub}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Show only if data exists */}
      {subscriptions.length > 0 && (
        <>
          <Chart subscriptions={subscriptions} />
          <CalendarView subscriptions={subscriptions} />
        </>
      )}
    </div>
  );
};

export default Dashboard;