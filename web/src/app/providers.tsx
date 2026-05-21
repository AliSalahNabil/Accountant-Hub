"use client";

import { Toaster } from "sonner";

import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        duration={1000}
        toastOptions={{
          style: {
            borderRadius: "0.75rem",
            border: "1px solid #e7e5e4",
          },
        }}
      />
    </AuthProvider>
  );
}
