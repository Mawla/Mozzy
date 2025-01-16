import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogsViewer } from "../../components/logs/logs-viewer";

export const metadata = {
  title: "System Logs | Mozzy Admin",
  description: "View system logs and error tracking",
};

export default async function LogsPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Logs</h1>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Error Logs</h2>
          <LogsViewer level="error" limit={50} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Warning Logs</h2>
          <LogsViewer level="warn" limit={50} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Info Logs</h2>
          <LogsViewer level="info" limit={50} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Debug Logs</h2>
          <LogsViewer level="debug" limit={50} />
        </div>
      </div>
    </div>
  );
}
