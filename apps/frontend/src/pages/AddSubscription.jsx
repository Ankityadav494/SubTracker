import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import SubscriptionForm from "../components/SubscriptionForm";
import TemplatePicker from "../components/TemplatePicker";
import { addSubscription } from "../services/subscriptionService";
import { useAuth } from "../hooks/useAuth";
import { cardClass, headingClass, pageClass } from "../utils/styles";

const AddSubscription = () => {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: params.get("name") || "",
    price: params.get("price") || "",
    category: params.get("category") || "",
    billingCycle: params.get("billingCycle") || "monthly",
    status: "active",
    nextBillingDate: params.get("nextBillingDate") || "",
    notes: "",
    shareWithHousehold: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.nextBillingDate) {
      return setError("All fields are required");
    }
    if (form.price <= 0) return setError("Price must be greater than 0");

    try {
      setLoading(true);
      setError("");
      await addSubscription(form);
      toast.success("Subscription added");
      navigate("/");
    } catch {
      setError("Failed to add subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Navbar />
      <main className={pageClass}>
        <h1 className={`mb-6 text-left ${headingClass}`}>Add subscription</h1>
        <div className={`max-w-lg ${cardClass}`}>
          <TemplatePicker
            onSelect={(t) => {
              const date = new Date();
              date.setDate(date.getDate() + 30);
              setForm({
                ...form,
                name: t.name,
                price: String(t.price),
                category: t.category,
                billingCycle: t.billingCycle,
                nextBillingDate: date.toISOString().split("T")[0],
              });
            }}
          />
          <SubscriptionForm
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            submitLabel="Add subscription"
            showHousehold={!!user?.household}
          />
        </div>
      </main>
    </Layout>
  );
};

export default AddSubscription;
