import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure this import is present
import "@/app/styles/tiptap.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "A Next.js 14 application with a default dashboard page",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
