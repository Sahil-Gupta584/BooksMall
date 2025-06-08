import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
      react(),
    ],
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
  };
});
