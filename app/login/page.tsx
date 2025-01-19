"use client";

import { AuthForm } from "../components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-[400px] p-4">
        <div className="border border-primary/20 rounded p-4">
          <AuthForm />
        </div>
      </div>
    </main>
  );
}
