import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import SubscriptionForm from "../components/SubscriptionForm";
import { getSubscription, updateSubscription } from "../services/subscriptionService";
import { cardClass, headingClass, pageClass } from "../utils/styles";
import { formatCurrency } from "../utils/subscriptionHelpers";

const EditSubscription = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSubscription(id)
      .then((sub) => {
        setForm({
          name: sub.name,
          price: String(sub.price),
          category: sub.category,
          billingCycle: sub.billingCycle || "monthly",
          status: sub.status || "active",
          nextBillingDate: new Date(sub.nextBillingDate).toISOString().split("T")[0],
          notes: sub.notes || "",
          priceHistory: sub.priceHistory,
        });
      })
      .catch(() => navigate("/"));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateSubscription(id, form);
      toast.success("Subscription updated");
      navigate("/");
    } catch {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!form) {
    return (
      <Layout>
        <div className="flex min-h-svh items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Navbar />
      <main className={pageClass}>
        <h1 className={`mb-6 text-left ${headingClass}`}>Edit subscription</h1>
        <div className={`max-w-lg ${cardClass}`}>
          {form.priceHistory?.length > 1 && (
            <div className="mb-4 rounded-lg border border-stone-700 bg-stone-800/50 p-3 text-left text-sm text-stone-400">
              <p className="font-medium text-orange-300">Price history</p>
              <ul className="mt-2 space-y-1">
                {[...form.priceHistory].reverse().slice(0, 5).map((h, i) => (
                  <li key={i}>
                    {formatCurrency(h.price)} — {new Date(h.recordedAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <SubscriptionForm
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            submitLabel="Save changes"
          />
        </div>
      </main>
    </Layout>
  );
};

export default EditSubscription;
