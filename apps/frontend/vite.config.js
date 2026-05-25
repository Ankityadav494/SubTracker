import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL || "";
  const useProxy = env.VITE_USE_PROXY === "true" || apiUrl === "/api";

  const proxyTarget =
    env.VITE_PROXY_TARGET || "https://subtracker-1-tsuh.onrender.com";

  return {
    plugins: [react()],
    server: useProxy
      ? {
          proxy: {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
              secure: true,
            },
          },
        }
      : undefined,
  };
});
