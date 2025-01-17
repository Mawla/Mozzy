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
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
