import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "./AppLayout";

export const metadata: Metadata = {
  title: "Trading Strategy Trainer",
  description: "Learn 151 Trading Strategies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
      </head>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}