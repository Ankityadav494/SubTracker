import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { acceptInvite } from "../services/householdService";
import { useAuth } from "../hooks/useAuth";

const AcceptHousehold = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/household/accept/${token}`);
      return;
    }
    acceptInvite(token)
      .then(() => {
        toast.success("Joined household!");
        navigate("/household");
      })
      .catch(() => {
        toast.error("Invalid or expired invite");
        navigate("/household");
      });
  }, [token, user, navigate, setUser]);

  return (
    <Layout>
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-slate-500">Accepting invite...</p>
      </div>
    </Layout>
  );
};

export default AcceptHousehold;
