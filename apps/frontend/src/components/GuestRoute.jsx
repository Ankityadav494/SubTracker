import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Layout from "./Layout";

/** Auth pages (login/signup) — redirect to dashboard if already signed in */
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout showChatBot={false}>
        <div className="flex min-h-svh items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
