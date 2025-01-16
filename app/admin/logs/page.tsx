import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogsViewer } from "../../components/logs/logs-viewer";

export const metadata = {
  title: "Logs | Admin",
  description: "View application logs",
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
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Application Logs</h1>
        <p className="text-muted-foreground mb-8">
          View and monitor application logs. Use the dropdown to switch between
          live logs and log files.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">All Logs</h2>
          <LogsViewer showFileSelector={true} limit={100} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Error Logs</h2>
          <LogsViewer level="error" limit={50} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Warning Logs</h2>
          <LogsViewer level="warn" limit={50} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Info Logs</h2>
          <LogsViewer level="info" limit={50} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <LogsViewer level="debug" limit={50} />
        </div>
      </div>
    </div>
  );
}
