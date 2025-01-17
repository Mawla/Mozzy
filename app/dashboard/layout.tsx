import { redirect } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { SignOutButton } from "@/app/components/auth/sign-out-button";
import { getUser } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-full relative bg-background text-foreground">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <div className="flex flex-col flex-grow">
          <Sidebar />
          <div className="p-4">
            <SignOutButton />
          </div>
        </div>
      </div>
      <main className="md:pl-72">
        <div className="px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
