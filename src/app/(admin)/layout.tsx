import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // This is now the main security gate for the entire admin section.
  if (!session) {
    redirect("/login");
  }

  return (
  <div className="flex h-screen overflow-hidden">
    {/* --- UPDATED: Sidebar will be hidden on small screens (mobile) --- */}
    <aside className="hidden md:block w-64 flex-shrink-0">
      <AdminSidebar />
    </aside>
    {/* --- UPDATED: Main content will take full width on mobile --- */}
    <main className="w-full flex-grow p-8 overflow-y-auto">
      {children}
    </main>
  </div>
);
}