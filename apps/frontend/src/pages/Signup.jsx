import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  sendSignupOtp,
  resendSignupOtp,
  verifySignupOtp,
} from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import AuthCard from "../components/AuthCard";
import Layout from "../components/Layout";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  errorClass,
  inputClass,
  labelClass,
  linkClass,
} from "../utils/styles";

const Signup = () => {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSendOtp = async (e) => {
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
      await sendSignupOtp(form);
      setStep("otp");
      setOtp("");
      toast.success("Verification code sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim() || otp.trim().length < 6) {
      return setError("Enter the 6-digit code from your email");
    }

    try {
      setLoading(true);
      setError("");
      const res = await verifySignupOtp({ email: form.email, otp: otp.trim() });
      setUser(res.user);
      toast.success("Email verified — welcome to SubTracker!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setError("");
      await resendSignupOtp(form.email);
      toast.success("New code sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="auth-viewport" showChatBot={false}>
      <AuthCard
        title={step === "form" ? "Create account" : "Verify your email"}
        subtitle={
          step === "form"
            ? "We'll send a one-time code to your email"
            : `Code sent to ${form.email}`
        }
        footer={
          <>
            Already have an account?{" "}
            <Link to="/login" className={linkClass}>
              Login
            </Link>
          </>
        }
      >
        {step === "form" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
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
              {loading ? "Sending code..." : "Send verification code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {error && <p className={errorClass}>{error}</p>}

            <div>
              <label htmlFor="otp" className={labelClass}>
                6-digit code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className={`${inputClass} text-center text-2xl tracking-[0.4em]`}
              />
            </div>

            <button type="submit" disabled={loading} className={btnPrimaryClass}>
              {loading ? "Verifying..." : "Verify & create account"}
            </button>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className={btnSecondaryClass}
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setError("");
                  setOtp("");
                }}
                className={btnSecondaryClass}
              >
                Change email
              </button>
            </div>
          </form>
        )}
      </AuthCard>
    </Layout>
  );
};

export default Signup;
