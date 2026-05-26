import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import SubscriptionForm from "../components/SubscriptionForm";
import TemplatePicker from "../components/TemplatePicker";
import { addSubscription } from "../services/subscriptionService";
import { useAuth } from "../hooks/useAuth";
import { cardClass, headingClass, mutedClass } from "../utils/styles";
import { defaultBillingDate } from "../utils/templates";

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

  const applyPlatform = (t) => {
    setForm({
      ...form,
      name: t.name,
      price: t.price > 0 ? String(t.price) : form.price,
      category: t.category || form.category,
      billingCycle: t.billingCycle || form.billingCycle,
      nextBillingDate: form.nextBillingDate || defaultBillingDate(),
    });
    toast.success(`${t.name} details filled in`);
  };

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
      navigate("/dashboard");
    } catch {
      setError("Failed to add subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-3 pb-12 pt-4 sm:px-4 sm:pb-16 sm:pt-6 lg:px-6">
        <header className="mb-8 text-center sm:text-left">
          <h1 className={headingClass}>Add subscription</h1>
          <p className={`mt-2 text-sm ${mutedClass}`}>
            Pick a platform, type its name for suggestions, or fill the form manually
          </p>
        </header>

        <div className={`${cardClass} lg:p-8`}>
          <TemplatePicker onSelect={applyPlatform} />

          <div
            className="my-8 flex items-center gap-3 lg:my-10"
            role="separator"
            aria-label="Manual entry"
          >
            <div className="h-px flex-1 bg-sky-200" />
            <span className={`shrink-0 text-xs font-semibold uppercase tracking-wide ${mutedClass}`}>
              Or enter manually
            </span>
            <div className="h-px flex-1 bg-sky-200" />
          </div>

          <div className="mx-auto w-full max-w-2xl">
            <SubscriptionForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              submitLabel="Add subscription"
              showHousehold={!!user?.household}
              platformAutocomplete
              onPlatformSelect={applyPlatform}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default AddSubscription;
