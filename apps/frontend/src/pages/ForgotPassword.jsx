import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import Layout from "../components/Layout";
import { forgotPassword } from "../services/authService";
import { btnPrimaryClass, errorClass, inputClass, labelClass, linkClass } from "../utils/styles";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword(email);
      setSent(true);
      toast.success("Check your email for reset link");
    } catch {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <AuthCard
        title="Forgot password"
        subtitle={sent ? "If an account exists, we sent a reset link." : "Enter your email"}
        footer={<Link to="/login" className={linkClass}>Back to login</Link>}
      >
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className={errorClass}>{error}</p>}
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
            </div>
            <button type="submit" disabled={loading} className={btnPrimaryClass}>
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        ) : null}
      </AuthCard>
    </Layout>
  );
};

export default ForgotPassword;
