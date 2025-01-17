import "./styles/globals.css";
import "./styles/tiptap.css";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "./components/error-boundary";
// import { LogProvider } from "./providers/log-provider";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Mozzy",
  description: "AI-powered content transformation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <LogProvider> */}
          <ErrorBoundary>
            {children}
            <Toaster />
          </ErrorBoundary>
          {/* </LogProvider> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
