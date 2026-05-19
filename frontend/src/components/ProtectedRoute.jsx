import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking auth
  if (loading) {
    return <p>Loading...</p>;
  }

  // If not logged in → redirect
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If logged in → allow access
  return children;
};

export default ProtectedRoute;