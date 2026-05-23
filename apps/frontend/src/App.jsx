import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import router from "./routes";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        containerClassName="!top-3 sm:!top-4"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#1e293b",
            border: "1px solid #bae6fd",
            boxShadow: "0 10px 25px rgba(14, 165, 233, 0.15)",
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
