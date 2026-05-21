import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { login, loginWithGithub } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import AuthCard from "../components/AuthCard";
import Layout from "../components/Layout";
import OAuthButtons from "../components/OAuthButtons";
import {
  btnPrimaryClass,
  errorClass,
  inputClass,
  labelClass,
  linkClass,
} from "../utils/styles";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const code = params.get("code");
    if (!code) return;
    loginWithGithub(code)
      .then((res) => {
        setUser(res.user);
        toast.success("Signed in with GitHub");
        setParams({});
        navigate("/");
      })
      .catch(() => {
        toast.error("GitHub sign-in failed");
        setParams({});
      });
  }, [params, navigate, setUser, setParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("All fields are required");
    try {
      setLoading(true);
      setError("");
      const res = await login(form);
      setUser(res.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="h-svh max-h-svh">
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to manage your subscriptions"
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link to="/signup" className={linkClass}>
              Sign up
            </Link>
          </>
        }
      >
        <OAuthButtons />
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-700" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wide sm:text-xs">
            <span className="bg-stone-900/70 px-2 text-stone-500">Or with email</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className={errorClass}>{error}</p>}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
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
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className={`text-sm ${linkClass}`}>
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading} className={btnPrimaryClass}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </AuthCard>
    </Layout>
  );
};

export default Login;
