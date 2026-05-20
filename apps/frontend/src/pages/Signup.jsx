import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signup } from "../services/authService";
import AuthCard from "../components/AuthCard";
import Layout from "../components/Layout";
import {
  btnPrimaryClass,
  errorClass,
  inputClass,
  labelClass,
  linkClass,
} from "../utils/styles";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      setError("");

      await signup(form);
      toast.success("Account created — please log in");
      navigate("/login");
    } catch {
      setError("Signup failed — email may already be in use");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <AuthCard
        title="Create account"
        subtitle="Start tracking your subscriptions"
        footer={
          <>
            Already have an account?{" "}
            <Link to="/login" className={linkClass}>
              Login
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className={errorClass}>{error}</p>}

          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
          </div>

          <button type="submit" disabled={loading} className={btnPrimaryClass}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </AuthCard>
    </Layout>
  );
};

export default Signup;
