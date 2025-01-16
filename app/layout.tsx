import "./styles/globals.css";
import "./styles/tiptap.css";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "./components/error-boundary";
import { LogProvider } from "./providers/log-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LogProvider>
          <ErrorBoundary>
            {children}
            <Toaster />
          </ErrorBoundary>
        </LogProvider>
      </body>
    </html>
  );
}
