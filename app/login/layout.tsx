import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Mozzy",
  description: "Login to your Mozzy account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
