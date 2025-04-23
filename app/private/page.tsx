import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-background rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Private Page</h1>
        <p className="text-muted-foreground mb-4">
          Welcome back, {user.email}!
        </p>
        <p className="text-sm text-muted-foreground">
          This page is only visible to authenticated users.
        </p>
      </div>
    </div>
  );
}
