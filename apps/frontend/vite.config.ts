import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      allowedHosts: [
        "5173-sahilgupta584-booksmall-od9sbywfmqd.ws-us121.gitpod.io",
      ],
    },
    plugins: [
      TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
      react(),
    ],
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
  };
});
