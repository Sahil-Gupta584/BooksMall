import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { Analytics } from "@vercel/analytics/next"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const queryClient = new QueryClient();

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider
            toastProps={{
              closeIcon: (
                <svg
                  fill="none"
                  height="32"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="32"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ),
              classNames: {
                closeButton:
                  "opacity-100 absolute right-4 top-1/2 -translate-y-1/2 ",
                title: ["text-lg capitalize "],
                description: ["text-md capitalize"],
                base: ["bg-background border border-gray-400 "],
              },
            }}
          />
          <Analytics/>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </HeroUIProvider>
    </StrictMode>
  );
}
