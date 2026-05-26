import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Layout from "./Layout";

/** App entry `/` — always send users to login or dashboard */
const HomeRedirect = () => {
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

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
};

export default HomeRedirect;
