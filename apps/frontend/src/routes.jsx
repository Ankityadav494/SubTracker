import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddSubscription from "./pages/AddSubscription";
import EditSubscription from "./pages/EditSubscription";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Household from "./pages/Household";
import AcceptHousehold from "./pages/AcceptHousehold";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  {
    path: "/add",
    element: (
      <ProtectedRoute>
        <AddSubscription />
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit/:id",
    element: (
      <ProtectedRoute>
        <EditSubscription />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/household",
    element: (
      <ProtectedRoute>
        <Household />
      </ProtectedRoute>
    ),
  },
  {
    path: "/household/accept/:token",
    element: (
      <ProtectedRoute>
        <AcceptHousehold />
      </ProtectedRoute>
    ),
  },
]);

export default router;
