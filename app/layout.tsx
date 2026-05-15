import type { Metadata } from "next";
import "./globals.css";
import "@alixpartners/ui-components/dist/assets/main.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./dashboard.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "TradingDesk — EOD snapshot",
  description: "Portfolio manager end-of-day dashboard (prototype)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="dashboard-body min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
