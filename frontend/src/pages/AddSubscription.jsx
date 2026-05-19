import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addSubscription } from "../services/subscriptionService";
import { CATEGORIES } from "../utils/constants";

const AddSubscription = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    nextBillingDate: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.name || !form.price || !form.category || !form.nextBillingDate) {
      return setError("All fields are required");
    }

    if (form.price <= 0) {
      return setError("Price must be greater than 0");
    }

    try {
      setLoading(true);
      setError("");

      await addSubscription(form);
      navigate("/");
    } catch (err) {
      setError("Failed to add subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Add Subscription</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="date"
          value={form.nextBillingDate}
          onChange={(e) =>
            setForm({ ...form, nextBillingDate: e.target.value })
          }
        />

        <button disabled={loading}>
          {loading ? "Adding..." : "Add Subscription"}
        </button>
      </form>
    </div>
  );
};

export default AddSubscription;