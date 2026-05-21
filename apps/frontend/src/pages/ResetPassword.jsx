import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import Layout from "../components/Layout";
import { resetPassword } from "../services/authService";
import { btnPrimaryClass, errorClass, inputClass, labelClass, linkClass } from "../utils/styles";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError("Password must be at least 6 characters");
    try {
      setLoading(true);
      await resetPassword(token, password);
      toast.success("Password reset — please log in");
      navigate("/login");
    } catch {
      setError("Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="h-svh max-h-svh">
      <AuthCard title="Reset password" footer={<Link to="/login" className={linkClass}>Login</Link>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className={errorClass}>{error}</p>}
          <div>
            <label className={labelClass}>New password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
          </div>
          <button type="submit" disabled={loading} className={btnPrimaryClass}>
            {loading ? "Saving..." : "Reset password"}
          </button>
        </form>
      </AuthCard>
    </Layout>
  );
};

export default ResetPassword;
