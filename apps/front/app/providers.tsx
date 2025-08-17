"use client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
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
        {children}
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
