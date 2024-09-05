import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Bank",
  description: "Manage your content bank",
};

export default function ContentBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
