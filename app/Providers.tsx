"use client";

import { ToastProvider } from "@alixpartners/ui-components";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider
      maxSnack={3}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      {children}
    </ToastProvider>
  );
}
